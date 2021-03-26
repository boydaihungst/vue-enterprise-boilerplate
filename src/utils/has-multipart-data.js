/**
 *
 * @param {*} obj
 */
export default function hasMultipartData(obj) {
  if (obj === null) return false;
  for (const propVal of Object.values(obj)) {
    if (
      propVal instanceof Blob ||
      propVal instanceof File ||
      propVal instanceof FileList
    ) {
      return true;
    }
    if (typeof propVal === 'object' && obj !== null) {
      return hasMultipartData(propVal);
    }
  }
  return false;
}
