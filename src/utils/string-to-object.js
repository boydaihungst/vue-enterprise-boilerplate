/**
 *
 * @param {string} str
 * @returns
 */
export default function stringToObject(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}
