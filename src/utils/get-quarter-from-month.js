/**
 *
 * @param {number} month
 * @returns 1 | 2 | 3 | 4
 * @throws {Error} message: MonthFormatInvalid
 */
export default function getQuarterFromMonth(month) {
  if (!month || typeof month !== 'number' || month < 0 || month > 11) {
    throw new Error('MonthFormatInvalid');
  }
  return Math.floor(month / 3) + 1;
}
