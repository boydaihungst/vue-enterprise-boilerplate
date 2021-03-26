// import { gql } from '@apollo/client/core';

// gql`
//   mutation generateTrackEventSession {
//     generateTrackEventSession
//   }

//   query FileChange($payload: FileChangeInput!) {
//     FileChange(payload: $payload) {
//       position
//       file {
//         _id
//         fileName
//         isPreviewable
//         previewInfo {
//           sm
//           md
//           lg
//           xl
//         }
//         height
//         width
//         fileSize
//         mimeType
//         description
//         publicStatus
//         shareMode
//         deleted
//         deletedDate
//         isFavorite
//         tags
//         owner {
//           _id
//           email
//           fullName
//         }
//         parentFolder {
//           _id
//           name
//           isRoot
//         }
//         lastModifier {
//           _id
//           email
//           fullName
//         }
//         updatedAt
//         createdAt
//       }
//     }
//   }

//   query FolderChange($payload: FolderChangeInput!) {
//     FolderChange(payload: $payload) {
//       position
//       folder {
//         _id
//         name
//         icon
//         color
//         isRoot
//         publicStatus
//         shareMode
//         deleted
//         deletedDate
//         isFavorite
//         owner {
//           _id
//           email
//           fullName
//         }
//         parentFolder {
//           _id
//           name
//           isRoot
//         }
//         lastModifier {
//           _id
//           email
//           fullName
//         }
//         updatedAt
//         createdAt
//       }
//     }
//   }
// `;
