import { gql } from '@apollo/client/core';

export default gql`
  directive @client on FIELD
  # type Query {
  #   fileFolderFilters: FileFolderFilters
  # }

  # type Mutation {
  #   changeFileFolderFilters(payload: ChangeFileFolderFiltersInput!): Boolean
  # }

  # type FileFolderFilters {
  #   isPreviewable: PREVIEWABLE
  #   height: Int
  #   width: Int
  #   fileSize: Long
  #   fileSizeGreaterAndEqual: Boolean
  #   tags: FILE_TAG

  #   name: String
  #   mimeType: String
  #   publicStatus: PUBLIC_STATUS
  #   shareMode: SHARE_MODE
  #   deleted: Boolean
  #   deletedDateFrom: DateTime
  #   deletedDateTo: DateTime
  #   owner: ID
  #   ownerName: String
  #   ownerEmail: EmailAddress
  #   ownerAccount: String
  #   parentFolder: ID
  #   lastModifier: ID
  #   updatedFrom: DateTime
  #   updatedTo: DateTime
  #   createdFrom: DateTime
  #   createdTo: DateTime
  #   sharedWiths: [ID!]
  #   sortBy: FILE_SORT_BY
  #   sortDir: SORT_DIRECTION
  #   limit: Int
  #   next: String
  # }

  # input ChangeFileFolderFiltersInput {
  #   isPreviewable: PREVIEWABLE
  #   height: Int
  #   width: Int
  #   fileSize: Long
  #   fileSizeGreaterAndEqual: Boolean
  #   tags: FILE_TAG

  #   name: String
  #   mimeType: String
  #   publicStatus: PUBLIC_STATUS
  #   shareMode: SHARE_MODE
  #   deleted: Boolean
  #   deletedDateFrom: DateTime
  #   deletedDateTo: DateTime
  #   owner: ID
  #   ownerName: String
  #   ownerEmail: EmailAddress
  #   ownerAccount: String
  #   parentFolder: ID
  #   lastModifier: ID
  #   updatedFrom: DateTime
  #   updatedTo: DateTime
  #   createdFrom: DateTime
  #   createdTo: DateTime
  #   sharedWiths: [ID!]
  #   sortBy: FILE_SORT_BY
  #   sortDir: SORT_DIRECTION
  #   limit: Int
  #   next: String
  # }

  # enum PREVIEWABLE {
  #   TRUE
  #   FALSE
  # }

  # enum PUBLIC_STATUS {
  #   PUBLIC
  #   PRIVATE
  # }

  # enum SHARE_MODE {
  #   NONE
  #   VIEWONLY
  #   EDITABLE
  # }

  # enum FILE_SORT_BY {
  #   NAME
  #   LAST_MODIFIED
  #   FILE_SIZE
  #   DOWNLOADED
  #   VIEWED
  # }

  # enum SORT_DIRECTION {
  #   ASC
  #   DESC
  # }

  # enum FOLDER_ICON {
  #   DEFAULT
  #   ACCOUNT
  #   ACCOUNT_OUTLINE
  #   ALERT
  #   ALERT_OUTLINE
  #   CLOCK
  #   CLOCK_OUTLINE
  #   COG
  #   COG_OUTLINE
  #   DOWNLOAD
  #   DOWNLOAD_OUTLINE
  #   EDIT
  #   EDIT_OUTLINE
  #   GOOGLE_DRIVE
  #   HEART
  #   HEART_OUTLINE
  #   HOME
  #   HOME_OUTLINE
  #   IMAGE
  #   INFORMATION
  #   INFORMATION_OUTLINE
  #   KEY
  #   KEY_OUTLINE
  #   KEY_NETWORK
  #   KEY_NETWORK_OUTLINE
  #   LOCK
  #   LOCK_OPEN
  #   MARKER
  #   MARKER_OUTLINE
  #   MOVE
  #   MOVE_OUTLINE
  #   MULTIPLE
  #   MULTIPLE_OUTLINE
  #   MULTIPLE_IMAGE
  #   MUSIC
  #   MUSIC_OUTLINE
  #   NETWORK
  #   NETWORK_OUTLINE
  #   STAR
  #   STAR_MULTIPLE
  #   STAR_MULTIPLE_OUTLINE
  #   STAR_OUTLINE
  #   ZIP
  #   ZIP_OUTLINE
  # }

  # enum FILE_TAG {
  #   IMAGE
  #   PDF
  #   DOCUMENT
  #   SPREADSHEET
  #   PRESENTATION
  #   AUDIO
  #   VIDEO
  #   ARCHIVE
  #   TEXT
  #   FONT
  # }
`;
