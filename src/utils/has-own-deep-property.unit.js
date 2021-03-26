import hasOwnDeepProperty from './has-own-deep-property';

describe('@utils/has-own-deep-property', () => {
  it('says hello', () => {
    const result = hasOwnDeepProperty();
    expect(result).toEqual('hello');
  });
});
