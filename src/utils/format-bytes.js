import memoizie from 'nano-memoize';

export default memoizie(
  /**
   *
   * @param {number} bytes
   * @param {number} [decimals=2]
   * @returns
   */
  (bytes, decimals = 2) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toString() +
      ' ' +
      sizes[i]
    );
  }
);
