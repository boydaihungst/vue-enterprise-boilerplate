/**
 *
 * @param {number} quater
 * @returns 1 | 4 | 7 | 10
 * @throws {Error} message: MonthFormatInvalid
 */
export default function getFirstMonthOfQuater(quater) {
  if (!quater || typeof quater !== 'number' || quater < 1 || quater > 4) {
    throw new Error('QuaterFormatInvalid');
  }
  return (quater - 1) * 3;
}
