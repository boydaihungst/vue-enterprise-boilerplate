class HttpException extends Error {
  /**
   *
   * @param {number} status
   * @param {string} message
   */
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
