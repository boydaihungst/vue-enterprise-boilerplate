import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import PAll from 'p-all';
import PRetry from 'p-retry';
import PQueue from 'p-queue';
import pThrottle from 'p-throttle';
import { UPLOAD_STATE } from '@utils/const';
import HttpException from '@src/api/exceptions/http-exception';

/**
 * @typedef {object} Subscriber
 * @property {UploadWorkerEvent} event
 * @property {string} subId
 * @property {function} fn
 */

/**
 * @typedef {object} PartialChunk
 * @property {number} fromByte
 * @property {number} toByte
 * @property {number} contentLength
 * @property {number} uploadedLength
 */

/**
 * @typedef {object} UploadItem
 * @property {string} id
 * @property {File} file
 * @property {string} parentFolder
 * @property {string} uploadUrl
 * @property {number} progress
 * @property {UPLOAD_STATE} state
 * @property {PartialChunk[]} chunks
 * @property {string} error
 */

/**
* @typedef {
| 'onListChange'
| 'addedItem'
| 'removedItem'
| 'updatedItem'
| 'onProgress'
| 'onError'
| 'onUploaded'
| 'createUploadSession'} UploadWorkerEvent
*/
export class UploadService {
  MAX_CONCURRENT_UPLOAD = 1;
  MAX_CONCURRENT_UPLOAD_CHUNK = 8;
  MAX_ERROR_RETRY_CHUNK = 5;
  MAX_FILE_SIZE = 4294967296;
  MAX_CHUNK_SIZE = 5242880;
  /** @type {*[]} */
  subscribers = [];
  /** @type {*[]} */
  queue = [];
  /** @type {Map<string, XMLHttpRequest[]>} */
  abortSignals = new Map();
  queueStartUpload = new PQueue({ concurrency: this.MAX_CONCURRENT_UPLOAD });
  throttleListQueue = pThrottle({ interval: 500, limit: 1 });
  listQueue() {
    return this.queue.map((x) => this.queueItemToPlainObj(x));
  }

  /**
   *
   * @param {*} item
   * @returns
   */
  queueItemToPlainObj(item) {
    const { id, file, uploadUrl, progress, state, error } = item;
    const _file = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
    return cloneDeep({
      id,
      file: _file,
      uploadUrl,
      progress,
      state,
      error,
    });
  }

  /**
   *
   * @param {*} file
   * @param {number} offset
   * @param {number} length
   * @returns
   */
  readChunkOfFile(file, offset, length) {
    return file.slice(offset, length + offset, 'application/octet-stream');
  }

  /**
   * Locally check file has valid size
   * @param {*} file
   * @returns
   */
  isFileValidate(file) {
    return file?.size <= this.MAX_FILE_SIZE;
  }

  /**
   * Start upload file to server
   * @param {*} itemFromQueue
   */
  async startUpload(itemFromQueue) {
    await this.queueStartUpload.add(async () => {
      if (
        itemFromQueue &&
        itemFromQueue.state !== UPLOAD_STATE.PENDING_TO_UPLOAD
      ) {
        return;
      }
      try {
        const stateBackup = itemFromQueue.state;
        itemFromQueue.state = UPLOAD_STATE.UPLOADING;
        if (!itemFromQueue?.uploadUrl) {
          itemFromQueue.uploadUrl = await this.createUploadSession(
            itemFromQueue.file.name,
            itemFromQueue.file.size,
            itemFromQueue.parentFolder
          );
          if (!itemFromQueue?.uploadUrl) {
            itemFromQueue.state = stateBackup;
            throw new HttpException(400, 'CANT_GET_UPLOAD_URL');
          }
        }
        // Fresh new Upload
        if (itemFromQueue.chunks.length === 0) {
          // Min 8 chunks| moi chunk 1 Mb. Neu duoi 8Mb -> 2 chunk
          // 20 chunks
          let chunksLength = itemFromQueue.file.size / this.MAX_CHUNK_SIZE;
          chunksLength = chunksLength > 1 ? Math.ceil(chunksLength) : 1; // = 8
          const sizedOfOneChunkFloored =
            chunksLength > 1 ? this.MAX_CHUNK_SIZE : +itemFromQueue.file.size;
          const leftOverSize =
            itemFromQueue.file.size - sizedOfOneChunkFloored * chunksLength;
          itemFromQueue.chunks = new Array(chunksLength);
          for (let i = 0; i < itemFromQueue.chunks.length; i++) {
            const fromByte = i * sizedOfOneChunkFloored;
            let toByte = fromByte + sizedOfOneChunkFloored - 1;
            if (i === itemFromQueue.chunks.length - 1) {
              toByte += leftOverSize;
            }
            itemFromQueue.chunks[i] = {
              fromByte,
              toByte,
              contentLength: toByte - fromByte,
              uploadedLength: 0,
            };
          }
        }
        const paritialChunkUploaders = itemFromQueue.chunks.map(
          (partial, partialIndex) => {
            return async () => {
              if (itemFromQueue.state !== UPLOAD_STATE.UPLOADING)
                throw new PRetry.AbortError('ABORTED');
              return await PRetry(
                async () => {
                  let uploadedLengthBackUp = 0;
                  let fromByteBackUp = 0;
                  // Truong hop resume => skip chunk nao da upload thanh cong
                  if (partial.uploadedLength - 1 === partial.contentLength)
                    return partial;
                  if (partial.uploadedLength > 0) {
                    uploadedLengthBackUp = partial.uploadedLength;
                    fromByteBackUp = partial.fromByte;
                  }
                  await new Promise((resolve, reject) => {
                    let blob = this.readChunkOfFile(
                      // @ts-ignore
                      itemFromQueue.__getTarget.file,
                      partial.fromByte,
                      partial.toByte - partial.fromByte + 1
                    );
                    const xhr = new XMLHttpRequest();
                    this.abortSignals.set(itemFromQueue.id, [
                      ...(this.abortSignals.get(itemFromQueue.id) || []),
                      xhr,
                    ]);
                    xhr.responseType = 'json';
                    xhr.open('post', itemFromQueue.uploadUrl, true);
                    xhr.setRequestHeader(
                      'Range',
                      `bytes ${partial.fromByte}-${partial.toByte}/${itemFromQueue.file.size}`
                    );
                    xhr.addEventListener('readystatechange', (e) => {
                      if (xhr.readyState === 4) {
                        if (blob) {
                          blob = null;
                        }
                        if ([201, 200, 206].includes(xhr.status)) {
                          return resolve(undefined);
                        } else if (xhr.status === 404) {
                          return reject(
                            new PRetry.AbortError(
                              xhr.response?.message || 'UNKNOWN'
                            )
                          );
                        } else {
                          return reject(
                            new Error(xhr.response?.message || 'UNKNOWN')
                          );
                        }
                      }
                    });
                    xhr.addEventListener('load', (e) => {
                      if (blob) {
                        blob = null;
                      }
                    });
                    xhr.addEventListener('abort', (e) => {
                      if (blob) {
                        blob = null;
                      }
                      reject(new PRetry.AbortError('ABORTED'));
                    });
                    if (xhr.upload) {
                      xhr.upload.addEventListener('progress', (e) => {
                        itemFromQueue.chunks[partialIndex].uploadedLength =
                          e.loaded + uploadedLengthBackUp;
                        itemFromQueue.chunks[partialIndex].fromByte =
                          e.loaded + fromByteBackUp - 1;
                        this.onProgress(itemFromQueue);
                      });
                    }
                    xhr.send(blob);
                  });
                  return partial;
                },
                {
                  onFailedAttempt: (error) => {
                    if (error?.message === 'ABORTED') {
                      throw error;
                    }
                  },
                  retries: this.MAX_ERROR_RETRY_CHUNK,
                }
              );
            };
          }
        );
        await PAll(paritialChunkUploaders, {
          concurrency: this.MAX_CONCURRENT_UPLOAD_CHUNK,
        });

        let totalUploadedByte = 0;
        for (const partial of itemFromQueue.chunks) {
          totalUploadedByte += partial.uploadedLength;
        }
        itemFromQueue.chunks = [];
        if (totalUploadedByte === itemFromQueue.file.size) {
          itemFromQueue.state = UPLOAD_STATE.FINISHED;
          this.onUploaded(itemFromQueue);
          this.abortSignals.delete(itemFromQueue?.id);
          // setTimeout(() => {
          //   ObservableSlim.remove(itemFromQueue);
          // }, 100);
          itemFromQueue.progress = 100;
        } else {
          throw new HttpException(500, 'File_CORRUPTED');
        }
      } catch (error) {
        if (error?.message !== 'ABORTED') {
          itemFromQueue.state = UPLOAD_STATE.ERROR;
          this.onError(itemFromQueue, error);
          this.abortUpload(itemFromQueue);
        }
      }
    });
  }

  /**
   * Pause upload
   */
  pause() {
    this.queue.forEach((itemFromQueue) => {
      if (
        [UPLOAD_STATE.UPLOADING, UPLOAD_STATE.PENDING_TO_UPLOAD].includes(
          itemFromQueue.state
        )
      ) {
        if (itemFromQueue.state === UPLOAD_STATE.UPLOADING) {
          this.abortUpload(itemFromQueue);
        }
        itemFromQueue.state = UPLOAD_STATE.PAUSED;
      }
    });
    this.queueStartUpload.clear();
  }

  /**
   * Push file to queue
   * @param {*|*[]} file
   * @param {string} parentFolder
   * @returns
   */
  enqueue(file, parentFolder) {
    const files = Array.isArray(file) ? file : [file];
    const queuedUploadItem = [];

    if (files.some((f) => !this.isFileValidate(f)))
      throw new Error('OVER_EXCCEED_FILE_SIZE');
    files.forEach((f) => {
      /** @type {UploadItem} */
      const newUploadItem = {
        id: uuidv4(),
        chunks: [],
        error: null,
        progress: 0,
        file: f,
        uploadUrl: null,
        parentFolder,
        state: UPLOAD_STATE.PENDING_TO_UPLOAD,
      };
      // const _newUploadItem = ObservableSlim.create(newUploadItem, true, () => {
      //   UploaderWorker.onListChange();
      // });
      queuedUploadItem.push(this.queueItemToPlainObj(newUploadItem));
      this.queue.push(newUploadItem);
      this.startUpload(newUploadItem)
        .then(() => {
          //
        })
        .catch(() => {
          //
        });
    });
    this.onListChange();
    return queuedUploadItem;
  }

  /**
   * Remove all uploading and queued file
   */
  removeAll() {
    this.queue.map((itemFromQueue) => {
      // ObservableSlim.remove(itemFromQueue);
      if ([UPLOAD_STATE.UPLOADING].includes(itemFromQueue.state)) {
        this.abortUpload(itemFromQueue);
      }
      itemFromQueue.state = UPLOAD_STATE.PAUSED;
      this.queue = [];
    });
    this.queueStartUpload.clear();
    this.onListChange();
  }

  /**
   * Remove a file in queue
   * @param {*} queueItem
   */
  remove(queueItem) {
    const itemFromQueue = this.queue.find((x) => x.id === queueItem?.id);

    if (!itemFromQueue || !queueItem) {
      throw new Error('NOT_FOUND_ITEM');
    }

    if ([UPLOAD_STATE.UPLOADING].includes(itemFromQueue.state)) {
      this.abortUpload(itemFromQueue);
    }
    // ObservableSlim.remove(itemFromQueue);
    const deltedItem = this.queue.splice(
      this.queue.findIndex((x) => x.id === queueItem?.id),
      1
    );
    this.removedItem(deltedItem.shift());
  }

  /**
   * Retry upload when file has upload error
   * @param {*} queueItem
   */
  async retry(queueItem) {
    const itemFromQueue = this.queue.find((x) => x.id === queueItem?.id);
    if (!itemFromQueue || !queueItem) {
      throw new Error('NOT_FOUND_ITEM');
    }

    if ([UPLOAD_STATE.ERROR].includes(itemFromQueue.state)) {
      itemFromQueue.state = UPLOAD_STATE.PENDING_TO_UPLOAD;
      await this.startUpload(itemFromQueue);
    }
  }

  /**
   * Resume paused upload
   */
  async resume() {
    const taskToResume = this.queue.map((itemFromQueue) => async () => {
      if (
        [UPLOAD_STATE.ERROR, UPLOAD_STATE.PAUSED].includes(itemFromQueue.state)
      ) {
        itemFromQueue.state = UPLOAD_STATE.PENDING_TO_UPLOAD;
        await this.startUpload(itemFromQueue);
      }
    });
    await PAll(taskToResume);
  }

  /**
   * internal funciton to abort upload a file
   * @protected
   * @param {*} itemFromQueue
   */
  abortUpload(itemFromQueue) {
    (this.abortSignals.get(itemFromQueue.id) || []).forEach((x) => {
      try {
        x.abort();
      } catch (error) {
        //
      }
    });
    this.abortSignals.delete(itemFromQueue.id);
  }

  /**
   * Create upload session for a file
   * @protected
   * @param {string} fileName
   * @param {number} fileSize
   * @param {string} folderId
   * @returns
   */
  async createUploadSession(fileName, fileSize, folderId) {
    let uploadUrl = '';
    const createUploadSessionSub = this.subscribers.find(
      (x) => x.event === 'createUploadSession'
    );
    if (createUploadSessionSub) {
      uploadUrl = await createUploadSessionSub.fn(fileName, fileSize, folderId);
    }
    return uploadUrl;
  }

  /**
   * Update file error
   * @param {*} queueItem
   * @param {*} error
   */
  onError(queueItem, error) {
    queueItem.error = cloneDeep(error);
  }

  /**
   * Update file upload progress
   * @param {*} queueItem
   */
  onProgress(queueItem) {
    let totalUploadedByte = 0;
    for (const partial of queueItem.chunks) {
      totalUploadedByte += partial.uploadedLength;
    }
    const progressPercent = +(
      (totalUploadedByte / queueItem.file.size) *
      100
    ).toFixed(1);
    queueItem.progress = progressPercent;
    this.updatedItem(queueItem);
  }

  /**
   * Notify subscriber for uploaded file
   * @param {*} queueItem
   */
  onUploaded(queueItem) {
    this.subscribers.forEach((x) => {
      if (x.event === 'onUploaded') x.fn(this.queueItemToPlainObj(queueItem));
    });
  }

  /**
   * Notify subscriber for new file added to queue
   * @param {*} queueItem
   */
  addedItem(queueItem) {
    this.subscribers.forEach((x) => {
      if (x.event === 'addedItem') x.fn(this.queueItemToPlainObj(queueItem));
    });
  }

  /**
   * Notify subscriber for updating file
   * @param {*} queueItem
   */
  updatedItem(queueItem) {
    this.subscribers.forEach((x) => {
      if (x.event === 'updatedItem') x.fn(this.queueItemToPlainObj(queueItem));
    });
  }

  /**
   * Notify subscriber for removing file
   * @param {*} queueItem
   */
  removedItem(queueItem) {
    this.subscribers.forEach((x) => {
      if (x.event === 'removedItem') x.fn(this.queueItemToPlainObj(queueItem));
    });
  }

  /**
   * Notify subscriber for list file changed
   * @returns
   */
  onListChange() {
    this.throttleListQueue(() => {
      this.subscribers.forEach((x) => {
        if (x.event === 'onListChange') x.fn();
      });
    });
  }

  /**
   * To subscribe for event
   * @param {*} event
   * @param {*} callback
   * @returns
   */
  addEventListener(event, callback) {
    const subId = uuidv4();
    this.subscribers.push({ event, subId, fn: callback });
    return subId;
  }

  /**
   * To unsubscribe of event
   * @param {string} subId
   */
  removeEventListener(subId) {
    this.subscribers.splice(
      this.subscribers.findIndex((x) => x.subId === subId),
      1
    );
  }
}
