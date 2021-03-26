import Vue from 'vue';
import * as Comlink from 'comlink';
// import { DownloaderWorker } from '@src/workers/downloader.worker';
import { UploadService } from '@api/file-upload.service';

const install = async () => {
  // /** @type {Comlink.Remote<DownloaderWorker>} */
  // const downloadWorkerInstance = Comlink.wrap(
  //   new Worker('../workers/downloader.worker', {
  //     type: 'module',
  //   })
  // );

  /** @type {Comlink.Remote<typeof UploadService>} */
  const UploadWorkderClass = Comlink.wrap(
    new Worker('@src/workers/uploader.worker', {
      type: 'module',
    })
  );
  // Vue.prototype.downloadWorker = downloadWorkerInstance;
  Vue.prototype.uploadWorker = await new UploadWorkderClass();
};
export { install };
