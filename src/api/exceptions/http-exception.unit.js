import httpException from './http-exception';

describe('@src/api/exceptions/http-exception', () => {
  it('says hello', () => {
    const MESSAGE = 'NotFound';
    const STATUS = 404;
    const result = new httpException(STATUS, MESSAGE);

    expect(result.status).toEqual(STATUS);
    expect(result.message).toEqual(MESSAGE);
  });
});
