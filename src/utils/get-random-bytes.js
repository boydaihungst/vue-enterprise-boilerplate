import crypto from 'crypto';
/**
 *
 * @param {number} size
 * @returns
 */
export default function getRandomBytes(size) {
  return crypto.randomBytes(size).toString('hex');
}
