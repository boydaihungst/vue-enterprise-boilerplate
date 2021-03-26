import * as Comlink from 'comlink';
import ObservableSlim from 'observable-slim';
import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import PRetry from 'p-retry';
import pAll from 'p-all';
import { File } from '@graphql/jsDoc';
import { DOWNLOAD_STATE } from '@utils/const';
import HttpException from '@src/api/exceptions/http-exception';
/**
 * @typedef {object} PartialChunk
 * @property {number} fromByte
 * @property {number} toByte
 * @property {number} contentLength
 * @property {Uint8Array[]} chunks
 * @property {number} receivedLength
 */

/**
 * @typedef {object} DownloadItem
 * @property {string=} id
 * @property {File=} file
 * @property {DOWNLOAD_STATE=} state
 * @property {PartialChunk[]=} chunks
 * @property {number=} progress
 * @property {string=} error
 */

/**
 * @typedef {'onListChange'|'onProgress'|'onError'|'onDownloaded'} DownloadWorkerEvent
 */

/**
 * @typedef {object} Subscriber
 * @property {DownloadWorkerEvent} event
 * @property {string} subId
 * @property {function} fn
 */

const MAX_CONCURRENT_DOWNLOAD = 1;
const MAX_CONCURRENT_DOWNLOAD_CHUNK = 8;
const MAX_ERROR_RETRY_CHUNK = 5;
/** @type {Subscriber[]} */
const subscribers = [];
/** @type {DownloadItem[]} */
const queue = [];
/** @type {Map<string, AbortController[]>} */
const abortSignals = new Map();

export const DownloaderWorker = {
  listQueue() {
    return queue.map((x) => this.queueItemToPlainObj(x));
  },
  queueItemToPlainObj(item) {
    const { file, progress, state, error } = item;
    return cloneDeep({
      file,
      progress,
      state,
      error,
    });
  },
  /**
   *
   * @param {DownloadItem} itemFromQueue
   * @returns
   */
  async startDownload(itemFromQueue) {
    if (itemFromQueue && itemFromQueue.state === DOWNLOAD_STATE.DOWNLOADING) {
      return;
    }
    const ItemInDownloadingState = queue.filter((x) =>
      [DOWNLOAD_STATE.DOWNLOADING].includes(x.state)
    );
    if (ItemInDownloadingState.length - 1 > MAX_CONCURRENT_DOWNLOAD) {
      return;
    }
    try {
      if (!itemFromQueue?.file?.downloadUrl) {
        throw new HttpException(400, 'CANT_GET_DOWNLOAD_URL');
      }
      itemFromQueue.state = DOWNLOAD_STATE.DOWNLOADING;

      // Fresh new Download
      if (itemFromQueue.chunks.length === 0) {
        // Min 8 chunks| moi chunk 1 Mb. Neu duoi 8Mb -> 2 chunk
        const concurrentDownloadChunk =
          itemFromQueue.file?.size > MAX_CONCURRENT_DOWNLOAD_CHUNK * 1048576
            ? MAX_CONCURRENT_DOWNLOAD_CHUNK
            : 2;
        const sizedOfOneChunkFloored = Math.trunc(
          itemFromQueue.file?.size / concurrentDownloadChunk
        );
        const leftOverSize =
          itemFromQueue.file?.size -
          sizedOfOneChunkFloored * concurrentDownloadChunk;
        itemFromQueue.chunks = new Array(concurrentDownloadChunk);
        for (let i = 0; i < itemFromQueue.chunks.length; i++) {
          const fromByte = i * sizedOfOneChunkFloored;
          let toByte = fromByte + sizedOfOneChunkFloored - 1;
          if (i === itemFromQueue.chunks.length - 1) {
            toByte += leftOverSize;
          }
          itemFromQueue.chunks[i] = {
            chunks: [],
            fromByte,
            toByte,
            contentLength: toByte - fromByte,
            receivedLength: 0,
          };
        }
      }
      const paritialChunkDownloaders = itemFromQueue.chunks.map(
        (partial, partialIndex) => () =>
          PRetry(
            async () => {
              // Truong hop resume => skip chunk nao da download thanh cong
              if (partial.receivedLength === partial.contentLength)
                return partial;
              const abortController = new AbortController();
              abortSignals.set(itemFromQueue.id, [
                ...(abortSignals.get(itemFromQueue.id) || []),
                abortController,
              ]);
              const request = new Request(itemFromQueue.file?.downloadUrl, {
                // credentials: 'include',
                method: 'get',
                signal: abortController.signal,
                headers: {
                  Range: `bytes=${partial.fromByte}-${partial.toByte}`,
                },
              });
              const response = await fetch(request);
              if (!response.ok) {
                if (response.status === 404) {
                  throw new PRetry.AbortError(
                    response?.statusText || 'UNKNOWN'
                  );
                }
                throw new Error(response?.statusText || 'UNKNOWN');
              }
              const reader = response.body.getReader();
              while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  break;
                }

                itemFromQueue.chunks[partialIndex].chunks.push(value);
                itemFromQueue.chunks[partialIndex].receivedLength +=
                  value.length;

                let totalDownloadedByte = 0;
                for await (const partial of itemFromQueue.chunks) {
                  totalDownloadedByte += partial.receivedLength;
                }
                const progressPercent = +(
                  (totalDownloadedByte / itemFromQueue.file?.size) *
                  100
                ).toFixed(1);
                this.onProgress(itemFromQueue, progressPercent);
              }
              return partial;
            },
            {
              onFailedAttempt: (error) => {
                itemFromQueue.chunks[partialIndex].chunks = [];
                itemFromQueue.chunks[partialIndex].receivedLength = 0;

                if (error.name === 'AbortError') {
                  throw error;
                }
              },
              retries: MAX_ERROR_RETRY_CHUNK,
            }
          )
      );
      await pAll(paritialChunkDownloaders, {
        concurrency: paritialChunkDownloaders.length,
      });
      let totalDownloadedByte = 0;
      const mergedChunk = [];
      for (const partial of itemFromQueue.chunks) {
        totalDownloadedByte += partial.receivedLength;
        // @ts-ignore
        mergedChunk.push(...partial.__getTarget.chunks);
      }

      // remove cache array;
      itemFromQueue.chunks = [];
      if (+totalDownloadedByte === +itemFromQueue.file?.size) {
        itemFromQueue.state = DOWNLOAD_STATE.FINISHED;
        // Start download next item
        const nextItemToDownload = queue.find(
          (x) =>
            x.file?.downloadUrl &&
            x.state === DOWNLOAD_STATE.PENDING_TO_DOWNLOAD
        );
        if (nextItemToDownload) {
          this.startDownload(nextItemToDownload)
            .then(() => {
              //
            })
            .catch(() => {
              //
            });
        }

        const blob = new Blob(mergedChunk);
        const blobURL = URL.createObjectURL(blob);
        this.onDownloaded(itemFromQueue, blobURL);
        abortSignals.delete(itemFromQueue?.id);
      } else {
        throw new Error('File_CORRUPTED');
      }
    } catch (error) {
      if (error?.name !== 'AbortError' && error?.message !== 'ABORTED') {
        itemFromQueue.state = DOWNLOAD_STATE.ERROR;
        this.onError(itemFromQueue, error);
        this.abortDownload(itemFromQueue);
      }
    }
  },
  /**
   *
   * @param {DownloadItem} itemToPause
   */
  pause(itemToPause) {
    const itemFromQueue = queue.find((x) => x.id === itemToPause?.id);
    if (!itemFromQueue) {
      throw new Error('NOT_FOUND');
    }
    if (itemFromQueue.state === DOWNLOAD_STATE.FINISHED) {
      throw new Error('ALREADY_FINISH');
    }
    if (
      [DOWNLOAD_STATE.DOWNLOADING, DOWNLOAD_STATE.PENDING_TO_DOWNLOAD].includes(
        itemFromQueue.state
      )
    ) {
      if (itemFromQueue.state === DOWNLOAD_STATE.DOWNLOADING) {
        this.abortDownload(itemFromQueue);
      }
      itemFromQueue.state = DOWNLOAD_STATE.PAUSED;
    }
  },
  /**
   *
   * @param {File} file
   * @returns
   */
  async enqueue(file) {
    const itemFromQueue = queue.find(
      (x) => x.file?.downloadUrl === file?.downloadUrl
    );
    if (itemFromQueue) {
      if (itemFromQueue.state === DOWNLOAD_STATE.FINISHED) {
        queue.splice(
          queue.findIndex((x) => x.id === itemFromQueue.id),
          1
        );
      } else if (
        [DOWNLOAD_STATE.ERROR, DOWNLOAD_STATE.PAUSED].includes(
          itemFromQueue.state
        )
      ) {
        await this.resume(itemFromQueue);
        return;
      } else {
        return this.queueItemToPlainObj(itemFromQueue);
      }
    }
    /** @type {DownloadItem} */
    const newDownloadItem = {
      id: uuidv4(),
      chunks: [],
      error: null,
      progress: 0,
      file,
      state: DOWNLOAD_STATE.PENDING_TO_DOWNLOAD,
    };
    const _newDownloadItem = ObservableSlim.create(
      newDownloadItem,
      true,
      () => {
        DownloaderWorker.onListChange();
      }
    );
    queue.push(_newDownloadItem);
    this.startDownload(_newDownloadItem)
      .then(() => {
        //
      })
      .catch(() => {
        //
      });
    return this.queueItemToPlainObj(_newDownloadItem);
  },
  /**
   *
   * @param {DownloadItem} queueItem
   */
  remove(queueItem) {
    const itemFromQueue = queue.find((x) => x.id === queueItem?.id);
    if (!itemFromQueue || !queueItem) {
      throw new Error('NOT_FOUND_DOWNLOAD_URL');
    }
    if ([DOWNLOAD_STATE.DOWNLOADING].includes(itemFromQueue.state)) {
      this.abortDownload(itemFromQueue);
    }
    ObservableSlim.remove(itemFromQueue);
    queue.splice(
      queue.findIndex((x) => x.id === queueItem?.id),
      1
    );
  },
  /**
   *
   * @param {DownloadItem} queueItem
   */
  async resume(queueItem) {
    const itemFromQueue = queue.find((x) => x.id === queueItem?.id);

    if (!itemFromQueue) {
      throw new Error('NOT_FOUND_DOWNLOAD_URL');
    }
    if (DOWNLOAD_STATE.DOWNLOADING === itemFromQueue.state) {
      throw new Error('ALREADY_DOWNLOADING');
    }
    if (DOWNLOAD_STATE.FINISHED === itemFromQueue.state) {
      throw new Error('ALREADY_FINISH');
    }
    if (
      [DOWNLOAD_STATE.ERROR, DOWNLOAD_STATE.PAUSED].includes(
        itemFromQueue.state
      )
    ) {
      itemFromQueue.state = DOWNLOAD_STATE.PENDING_TO_DOWNLOAD;
      await this.startDownload(itemFromQueue);
    }
  },
  /**
   *
   * @param {DownloadItem} itemFromQueue
   */
  abortDownload(itemFromQueue) {
    (abortSignals.get(itemFromQueue?.id) || []).forEach((x) => {
      if (!x.signal.aborted) x.abort();
    });
    abortSignals.delete(itemFromQueue?.id);
  },
  /**
   *
   * @param {DownloadItem} queueItem
   * @param {DownloadWorkerEvent} error
   */
  onError(queueItem, error) {
    queueItem.error = cloneDeep(error);
    subscribers.forEach((x) => {
      if (x.event === 'onError')
        x.fn(this.queueItemToPlainObj(queueItem), queueItem.error);
    });
  },
  /**
   *
   * @param {DownloadItem} queueItem
   * @param {number} percent
   */
  onProgress(queueItem, percent) {
    queueItem.progress = percent;
    subscribers.forEach((x) => {
      if (x.event === 'onProgress')
        x.fn(this.queueItemToPlainObj(queueItem), percent);
    });
  },
  /**
   *
   * @param {DownloadItem} queueItem
   * @param {string} blobURL
   */
  onDownloaded(queueItem, blobURL) {
    // const buffer = await data.arrayBuffer();
    subscribers.forEach((x) => {
      if (x.event === 'onDownloaded')
        x.fn(this.queueItemToPlainObj(queueItem), blobURL);
    });
  },
  /**
   *
   */
  onListChange() {
    subscribers.forEach((x) => {
      if (x.event === 'onListChange') x.fn();
    });
  },
  /**
   *
   * @param {DownloadWorkerEvent} event
   * @param {function} callback
   * @returns
   */
  addEventListener(event, callback) {
    const subId = uuidv4();
    subscribers.push({ event, subId, fn: callback });
    return subId;
  },
  /**
   *
   * @param {string} subId
   */
  removeEventListener(subId) {
    subscribers.splice(
      subscribers.findIndex((x) => x.subId === subId),
      1
    );
  },
};

Comlink.expose(DownloaderWorker);
