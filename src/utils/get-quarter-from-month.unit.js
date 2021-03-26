import getQuarterFromMonth from './get-quarter-from-month';

describe('@utils/get-quarter-from-month', () => {
  it('says hello', () => {
    const result = getQuarterFromMonth(2);
    expect(result).toEqual(1);
  });
});
