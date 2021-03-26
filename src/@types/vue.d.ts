import * as Comlink from 'comlink';
// import { DownloaderWorker } from '@src/workers/downloader.worker';
import { UploadService } from '@api/file-upload.service';
import { AuthorizedToken } from '@graphql/jsDoc';

export interface ApolloHelperTypes {
  getToken(): string;
  getRefreshToken(tokenName?: string): string;
  renewTokens(apolloClient, refreshToken): Promise<void>;
  onLogout(apolloClient?: ApolloClient<any>): Promise<void>;
  onLogin(
    token: AuthorizedToken,
    apolloClient?: ApolloClient<any>
  ): Promise<void>;
}
declare module 'vue/types/vue' {
  interface Vue {
    $style: { [key: string]: string };
    // downloadWorker: Comlink.Remote<DownloaderWorker>;
    uploadWorker: Comlink.Remote<UploadService>;
    $apolloHelpers: ApolloHelperTypes;
    $mdiIcons: mdiV5Icon;
    player: Plyr;
  }
}
