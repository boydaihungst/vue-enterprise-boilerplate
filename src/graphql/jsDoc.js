/* eslint-disable prettier/prettier */ export {};
/**
 * @typedef {Object} Mimetype
 * @property {string} value
 */

/**
 * @typedef {Object} FileStatistic
 * @property {BigInt} downloaded
 * @property {BigInt} viewed
 */

/**
 * The `BigInt` scalar type represents non-fractional signed whole numeric values.
 * @typedef {*} BigInt
 */

/**
 * @typedef {Object} File
 * @property {string} id
 * @property {string} name
 * @property {boolean} [isPublic]
 * @property {BigInt} [size]
 * @property {string} [description]
 * @property {User} owner
 * @property {User} lastModifier
 * @property {DateTime} [keepTrashUntilDate]
 * @property {FileStatistic} statistic
 * @property {FILE_TYPE} type
 * @property {boolean} isPreviewable
 * @property {number} [height]
 * @property {number} [width]
 * @property {FILE_TAG} [tag]
 * @property {string} [extension]
 * @property {string} [mimetype]
 * @property {FilePreviewInfo} [previewInfo]
 * @property {string} [downloadUrl]
 * @property {string} [shareUrl]
 * @property {Folder} [parentFolder]
 */

/**
 * The javascript `Date` as string. Type represents date and time as the ISO Date string.
 * @typedef {*} DateTime
 */

/**
 * @typedef {("FOLDER"|"FILE")} FILE_TYPE
 */

/**
 * @typedef {("IMAGE"|"PDF"|"DOCUMENT"|"SPREADSHEET"|"PRESENTATION"|"AUDIO"|"VIDEO"|"ARCHIVE"|"FONT"|"TEXT"|"UNKNOWN")} FILE_TAG
 */

/**
 * @typedef {Object} PhoneNumberPrefix
 * @property {string} value
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} account
 * @property {string} email
 * @property {boolean} [emailVerified]
 * @property {string} [phoneNumber]
 * @property {string} [phonePrefix]
 * @property {boolean} [phoneNumberVerified]
 * @property {Avatar} [avatar]
 * @property {string} fullName
 */

/**
 * @typedef {Object} Folder
 * @property {string} id
 * @property {string} name
 * @property {boolean} [isPublic]
 * @property {BigInt} [size]
 * @property {string} [description]
 * @property {User} owner
 * @property {User} lastModifier
 * @property {DateTime} [keepTrashUntilDate]
 * @property {FileStatistic} statistic
 * @property {FILE_TYPE} type
 * @property {boolean} isRoot
 * @property {FOLDER_ICON} [icon]
 * @property {string} [color]
 * @property {string} [downloadUrl]
 * @property {string} [shareUrl]
 * @property {Array<FileFolder>} [childrens]
 * @property {Folder} [parentFolder]
 */

/**
 * @typedef {("DEFAULT"|"ACCOUNT"|"ACCOUNT_OUTLINE"|"ALERT"|"ALERT_OUTLINE"|"CLOCK"|"CLOCK_OUTLINE"|"COG"|"COG_OUTLINE"|"DOWNLOAD"|"DOWNLOAD_OUTLINE"|"EDIT"|"EDIT_OUTLINE"|"GOOGLE_DRIVE"|"HEART"|"HEART_OUTLINE"|"HOME"|"HOME_OUTLINE"|"IMAGE"|"INFORMATION"|"INFORMATION_OUTLINE"|"KEY"|"KEY_OUTLINE"|"KEY_NETWORK"|"KEY_NETWORK_OUTLINE"|"LOCK"|"LOCK_OPEN"|"MARKER"|"MARKER_OUTLINE"|"MOVE"|"MOVE_OUTLINE"|"MULTIPLE"|"MULTIPLE_OUTLINE"|"MULTIPLE_IMAGE"|"MUSIC"|"MUSIC_OUTLINE"|"NETWORK"|"NETWORK_OUTLINE"|"STAR"|"STAR_MULTIPLE"|"STAR_MULTIPLE_OUTLINE"|"STAR_OUTLINE"|"ZIP"|"ZIP_OUTLINE")} FOLDER_ICON
 */

/**
 * @typedef {(File|Folder)} FileFolder
 */

/**
 * File preview information
 * @typedef {Object} FilePreviewInfo
 * @property {string} sm
 * @property {string} md
 * @property {string} lg
 * @property {string} xl
 */

/**
 * @typedef {Object} Cursor
 * @property {string} [beforeCursor]
 * @property {string} [afterCursor]
 */

/**
 * @typedef {Object} FileFolderPaginated
 * @property {Array<FileFolder>} [data]
 * @property {number} [total]
 * @property {Cursor} [cursor]
 */

/**
 * Share file folder token content
 * @typedef {Object} ShareFileFolderToken
 * @property {FILE_TYPE} type
 * @property {string} fileId
 */

/**
 * @typedef {Object} PaginatedUser
 * @property {Array<User>} [data]
 * @property {number} [total]
 * @property {Cursor} [cursor]
 */

/**
 * @typedef {Object} Avatar
 * @property {string} id
 * @property {string} url
 * @property {string} [mimetype]
 * @property {BigInt} size
 */

/**
 * JWT token
 * @typedef {Object} Token
 * @property {string} token
 * @property {number} iat
 * @property {number} exp
 */

/**
 * Include refresh and access token
 * @typedef {Object} AuthorizedToken
 * @property {Token} access
 * @property {Token} refresh
 */

/**
 * Create Upload Session input
 * @typedef {Object} CreateUploadSessionInput
 * @property {string} fileName
 * @property {BigInt} fileSize
 * @property {string} folderId
 */

/**
 * Update file input
 * @typedef {Object} UpdateFileInput
 * @property {string} fileId
 * @property {string} [name]
 * @property {boolean} [isPublic]
 * @property {string} [description]
 * @property {string} [parentFolder]
 * @property {Array<EmailAddress>} [usersEmailAddToShareList]
 * @property {Array<EmailAddress>} [usersEmailRemoveFromShareList]
 */

/**
 * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
 * @typedef {*} EmailAddress
 */

/**
 * Delete file input
 * @typedef {Object} DeleteFileInput
 * @property {string} fileId
 * @property {boolean} [permanent]
 */

/**
 * change file favorite input
 * @typedef {Object} ChangeFileFavoriteInput
 * @property {string} fileId
 * @property {boolean} isFavorite
 */

/**
 * Move file folder input
 * @typedef {Object} MoveFileFolderInput
 * @property {string} parentFolder
 * @property {Array<string>} chilrensToMove
 */

/**
 * Create folder input
 * @typedef {Object} CreateFolderInput
 * @property {string} name
 * @property {string} parentFolder
 * @property {string} [description]
 * @property {string} [color]
 * @property {FOLDER_ICON} [icon]
 */

/**
 * Update folder input
 * @typedef {Object} UpdateFolderInput
 * @property {string} folderId
 * @property {string} [name]
 * @property {string} [description]
 * @property {FOLDER_ICON} [icon]
 * @property {string} [color]
 * @property {boolean} [isPublic]
 * @property {string} [parentFolder]
 * @property {Array<EmailAddress>} [usersEmailAddToShareList]
 * @property {Array<EmailAddress>} [usersEmailRemoveFromShareList]
 */

/**
 * Delete folder input
 * @typedef {Object} DeleteFolderInput
 * @property {string} folderId
 * @property {boolean} [permanent]
 */

/**
 * change file favorite input
 * @typedef {Object} GenerateShareUrlInput
 * @property {string} fileId
 */

/**
 * SignUp input
 * @typedef {Object} SignUpInput
 * @property {string} account
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirmation
 * @property {string} phone
 * @property {string} phonePrefix
 * @property {string} recaptcha
 */

/**
 * RequestResetPassword input
 * @typedef {Object} RequestResetPasswordInput
 * @property {string} email
 * @property {string} recaptcha
 */

/**
 * ResetPassword input
 * @typedef {Object} ResetPasswordInput
 * @property {string} token
 * @property {string} newPassword
 * @property {string} recaptcha
 */

/**
 * ChangePassword input
 * @typedef {Object} ChangePasswordInput
 * @property {string} oldPassword
 * @property {string} newPassword
 */

/**
 * UpdateUserInfo input
 * @typedef {Object} UpdateUserInfoInput
 * @property {string} [phone]
 * @property {string} [phonePrefix]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {Upload} [avatarUpload]
 */

/**
 * The `Upload` scalar type represents a file upload.
 * @typedef {*} Upload
 */

/**
 * VerifyAccount input
 * @typedef {Object} VerifyAccountInput
 * @property {string} verifyCode
 * @property {SIGNUP_VERIFY_TYPE} verifyType
 * @property {string} recaptcha
 */

/**
 * @typedef {("PHONE"|"EMAIL")} SIGNUP_VERIFY_TYPE
 */

/**
 * Login input
 * @typedef {Object} LoginInput
 * @property {string} emailOrAccount
 * @property {string} password
 * @property {string} recaptcha
 */

/**
 * RenewToken input
 * @typedef {Object} RenewTokenInput
 * @property {string} refreshToken
 */

/**
 * ResendSignUpCode input
 * @typedef {Object} ResendSignUpCodeInput
 * @property {SIGNUP_VERIFY_TYPE} verifyType
 */

/**
 * @typedef {Object} Query
 * @property {File} [file] - Get file
 * @property {FileFolderPaginated} [fileFolderFilter] - Find file and folder by critical
 * @property {ShareFileFolderToken} [fileFolderUsingShareToken] - Get content of share file folder token
 * @property {Folder} [folder] - Get folder information
 * @property {PaginatedUser} [getSharingUsersOfFileFolder] - Get list of user who have permission to access file or folder
 * @property {boolean} [accessTokenValidation] - Verify access token
 * @property {User} [currentUser] - Get current logged in user
 * @property {PaginatedUser} [findUser] - Find user by critical
 * @property {User} [user] - Fetch user by account
 * @property {boolean} [validateResetPwToken] - Check reset password token is validation
 */

/**
 * @typedef {("ASC"|"DESC")} ORDER_BY
 */

/**
 * @typedef {("EQUAL_TO"|"GREATER_THAN"|"LESS_THAN"|"GREATER_OR_EQUAL"|"LESS_OR_EQUAL"|"NOT_EQUAL")} COMPARE_OPERATOR
 */

/**
 * @typedef {("ANY_POSITION"|"STARTS_WITH"|"ENDS_WITH")} SEARCH_METHOD
 */

/**
 * @typedef {("NAME"|"LAST_MODIFIED_DATE"|"SIZE"|"DOWNLOADED"|"VIEWED")} FILE_SORT_BY
 */

/**
 * @typedef {Object} Mutation
 * @property {boolean} [changeFileFavorite] - Mutation to add|remove file or folder to|from favorite
 * @property {Folder} [createFolder] - Mutation to create upload session
 * @property {string} [createUploadSession] - Mutation to create upload session
 * @property {boolean} [deleteFile] - Mutation to delete file
 * @property {boolean} [deleteFolder] - Mutation to delete folder
 * @property {string} [generateShareUrl] - Mutation to add|remove file or folder to|from favorite
 * @property {boolean} [moveFileFolder] - Mutation to move file or folder to another parent
 * @property {File} [updateFile] - Mutation to update file
 * @property {Folder} [updateFolder] - Mutation to update folder
 * @property {boolean} [changePassword] - Mutation to change password
 * @property {AuthorizedToken} [login] - Mutation to login user
 * @property {AuthorizedToken} [renewToken] - Mutation to renewToken user
 * @property {boolean} [requestResetPassword] - Mutation to request reset password
 * @property {DateTime} [resendSignUpCode] - Mutation to resendsignupcode user
 * @property {boolean} [resetPassword] - Mutation to request reset password
 * @property {AuthorizedToken} [signUp] - Mutation to signup user
 * @property {User} [updateUserInfo] - Mutation to update user information
 * @property {boolean} [verifyAccount] - Mutation to verifyaccount user
 */

/**
 * @typedef {Object} Subscription
 * @property {User} [notifyUserUpdated] - Subscriptions for updated user
 */
