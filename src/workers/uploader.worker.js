import * as Comlink from 'comlink';
import { UploadService } from '@api/file-upload.service'

Comlink.expose(UploadService);
