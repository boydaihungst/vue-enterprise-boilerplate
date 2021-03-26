// import { gql } from '@apollo/client/core';

// const Folder = gql`
//   query folder($folderId: ID, $shareToken: String) {
//     folder(folderId: $folderId, shareToken: $shareToken) {
//       id
//       name
//       isPublic
//       description
//       owner {
//         id
//         fullName
//         email
//       }
//       lastModifier {
//         id
//         fullName
//         email
//       }
//       keepTrashUntilDate
//       statistic {
//         downloaded
//         viewed
//       }
//       type
//       isRoot
//       icon
//       color
//     }
//   }
// `;

// const createFolder = gql`
//   mutation createFolder($payload: CreateFolderInput!) {
//     createFolder(payload: $payload) {
//       id
//       name
//       isPublic
//       description
//       keepTrashUntilDate
//       statistic {
//         downloaded
//         viewed
//       }
//       type
//       icon
//       color
//     }
//   }
// `;

// const updateFolder = gql`
//   mutation updateFolder($payload: UpdateFolderInput!) {
//     updateFolder(payload: $payload) {
//       id
//       name
//       isPublic
//       description
//       keepTrashUntilDate
//       statistic {
//         downloaded
//         viewed
//       }
//       type
//       icon
//       color
//       childrens {
//         ... on Folder {
//           name
//         }
//         ... on File {
//           name
//         }
//       }
//     }
//   }
// `;

// const deleteFolder = gql`
//   mutation deleteFolder($payload: DeleteFolderInput!) {
//     deleteFolder(payload: $payload)
//   }
// `;

// const getFileDownloadUrl = gql`
//   query getFileDownloadUrl($fileId: ID, $shareToken: String) {
//     file(fileId: $fileId, shareToken: $shareToken) {
//       id
//       downloadUrl
//     }
//   }
// `;

// const getFolderDownloadUrl = gql`
//   query getFolderDownloadUrl($folderId: ID, $shareToken: String) {
//     folder(folderId: $folderId, shareToken: $shareToken) {
//       id
//       downloadUrl
//     }
//   }
// `;

// const file = gql`
//   query file($fileId: ID, $shareToken: String) {
//     file(fileId: $fileId, shareToken: $shareToken) {
//       id
//       name
//       isPublic
//       description
//       owner {
//         id
//         fullName
//         email
//       }
//       lastModifier {
//         id
//         fullName
//         email
//       }
//       keepTrashUntilDate
//       statistic {
//         downloaded
//         viewed
//       }
//       type
//       isPreviewable
//       size
//       height
//       width
//       tag
//       extension
//       mimetype
//       previewInfo {
//         sm
//         md
//         lg
//         xl
//       }
//     }
//   }
// `;

// const createUploadSession = gql`
//   mutation createUploadSession($payload: CreateUploadSessionInput!) {
//     createUploadSession(payload: $payload)
//   }
// `;

// const updateFile = gql`
//   mutation updateFile($payload: UpdateFileInput!) {
//     updateFile(payload: $payload) {
//       id
//       name
//       isPublic
//       description
//       owner {
//         id
//         fullName
//         email
//       }
//       lastModifier {
//         id
//         fullName
//         email
//       }
//       keepTrashUntilDate
//       statistic {
//         downloaded
//         viewed
//       }
//       type
//       isPreviewable
//       size
//       height
//       width
//       tag
//       extension
//       mimetype
//       previewInfo {
//         sm
//         md
//         lg
//         xl
//       }
//     }
//   }
// `;

// const deleteFile = gql`
//   mutation deleteFile($payload: DeleteFileInput!) {
//     deleteFile(payload: $payload)
//   }
// `;

// const changeFileFolderFavorite = gql`
//   mutation changeFileFavorite($payload: ChangeFileFavoriteInput!) {
//     changeFileFavorite(payload: $payload)
//   }
// `;
// const generateFileFolderShareUrl = gql`
//   mutation generateShareUrl($payload: GenerateShareUrlInput!) {
//     generateShareUrl(payload: $payload)
//   }
// `;
