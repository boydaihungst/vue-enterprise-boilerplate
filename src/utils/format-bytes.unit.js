import formatBytes from './format-bytes';

describe('@utils/format-bytes', () => {
  it('says hello', () => {
    const result = formatBytes(1024);
    expect(result).toEqual('1 KB');
  });
});
