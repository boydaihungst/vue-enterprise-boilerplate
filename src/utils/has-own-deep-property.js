/**
 *
 * @param {*} obj
 * @param {*} prop
 * @returns
 */
export default function hasOwnDeepProperty(obj, prop) {
  if (typeof obj === 'object' && obj !== null) {
    if (obj.hasOwnProperty(prop)) {
      return true;
    }
    for (const p in obj) {
      if (obj.hasOwnProperty(p) && hasOwnDeepProperty(obj[p], prop)) {
        return true;
      }
    }
  }
  return false;
}
