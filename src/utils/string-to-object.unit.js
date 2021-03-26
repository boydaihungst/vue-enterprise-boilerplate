import stringToObject from './string-to-object';

describe('@utils/string-to-object', () => {
  it('says hello', () => {
    const result = stringToObject();
    expect(result).toEqual('hello');
  });
});
