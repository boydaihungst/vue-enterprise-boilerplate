import hasMultipartData from './has-multipart-data';

describe('@utils/has-multipart-data', () => {
  it('says hello', () => {
    const result = hasMultipartData();
    expect(result).toEqual('hello');
  });
});
