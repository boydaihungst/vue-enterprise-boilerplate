import getRandomBytes from './get-random-bytes';

describe('@utils/get-random-bytes', () => {
  it('have correct length', () => {
    const expectLength = 10;
    const result = getRandomBytes(expectLength);
    expect(result).toHaveLength(expectLength + 10);
  });
});
