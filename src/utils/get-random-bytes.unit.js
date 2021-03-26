import getRandomBytes from './get-random-bytes';

describe('@utils/get-random-bytes', () => {
  it('says hello', () => {
    const result = getRandomBytes();
    expect(result).toEqual('hello');
  });
});
