/**
 *
 * @readonly
 * @enum {string}
 */
export const REGEX = {
  POSITIVE_NUMBER: '^([+-]?[1-9]\\d*|0)$',
  RESET_PASSWORD: '^(?=.*[0-9])(?=.*[a-z])([a-z0-9]{8,8})$',
  PASSWORD: '^(?=.*[0-9])(?=.*[a-z])([a-zA-Z0-9]{8,20})$',
  EMAIL: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$',
  ACCOUNT: '^(?=.*[a-z])([a-zA-Z0-9]{5,30})$',
  PHONE: '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
  HEX_COLOR: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
};

/**
 * @readonly
 */
export const TextMimeTypeMap = [
  { suffix: 'md', type: 'markdown' },
  { suffix: 'txt', type: 'text' },
  { suffix: 'js', type: 'code', language: 'js' },
  { suffix: 'html', type: 'code', language: 'html' },
  { suffix: 'htm', type: 'code', language: 'htm' },
  { suffix: 'css', type: 'code', language: 'css' },
  { suffix: 'java', type: 'code', language: 'java' },
  { suffix: 'json', type: 'code', language: 'json' },
  { suffix: 'ts', type: 'code', language: 'ts' },
  { suffix: 'cpp', type: 'code', language: 'cpp' },
  { suffix: 'xml', type: 'code', language: 'xml' },
  { suffix: 'bash', type: 'code', language: 'bash' },
  { suffix: 'less', type: 'code', language: 'less' },
  { suffix: 'nginx', type: 'code', language: 'nginx' },
  { suffix: 'php', type: 'code', language: 'php' },
  { suffix: 'ps1', type: 'code', language: 'powershell' },
  { suffix: 'py', type: 'code', language: 'python' },
  { suffix: 'pyi', type: 'code', language: 'python' },
  { suffix: 'pyc', type: 'code', language: 'python' },
  { suffix: 'pyd', type: 'code', language: 'python' },
  { suffix: 'pyo', type: 'code', language: 'python' },
  { suffix: 'pyw', type: 'code', language: 'python' },
  { suffix: 'pyz', type: 'code', language: 'python' },
  { suffix: 'scss', type: 'code', language: 'scss' },
  { suffix: 'shell', type: 'code', language: 'shell' },
  { suffix: 'sql', type: 'code', language: 'sql' },
  { suffix: 'yaml', type: 'code', language: 'yaml' },
  { suffix: 'ini', type: 'code', language: 'ini' },
];

/**
 * @readonly
 * @enum {number}
 */
export const DOWNLOAD_STATE = {
  DOWNLOADING: 1,
  PAUSED: 2,
  ERROR: 3,
  PENDING_TO_DOWNLOAD: 4,
  FINISHED: 5,
};

/**
 * @readonly
 * @enum {string}
 */
export const RECAPTCHA_ACTION = {
  RESET_PASSWORD: '1',
  SIGN_UP: '2',
  VERIFY_ACCOUNT: '3',
  LOGIN: '4',
  REQUEST_RESET_PASSWORD: '5',
};

/**
 * @readonly
 * @enum {number}
 */
export const UPLOAD_STATE = {
  UPLOADING: 1,
  PAUSED: 2,
  ERROR: 3,
  PENDING_TO_UPLOAD: 4,
  FINISHED: 5,
};

/**
 * @readonly
 * @enum {number}
 */
export const PDF_PASSWORD_REASON = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2,
};
