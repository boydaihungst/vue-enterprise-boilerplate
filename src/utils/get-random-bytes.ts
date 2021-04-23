import crypto from 'crypto';
/**
 *
 * @param {number} size
 * @returns
 */
export default function getRandomBytes(size: number) {
  return crypto.randomBytes(size).toString('hex');
}
