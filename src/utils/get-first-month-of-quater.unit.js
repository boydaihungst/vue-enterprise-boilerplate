import getFirstMonthOfQuater from './get-first-month-of-quater';

describe('@utils/get-first-month-of-quater', () => {
  it('says hello', () => {
    const result = getFirstMonthOfQuater(1);
    expect(result).toEqual(1);
  });
});
