import { Observable } from '@apollo/client/core';

/**
 *
 * @param {Promise<any>} promise
 * @returns
 */
export default function promiseToObservable(promise) {
  return new Observable((subscriber) => {
    promise.then(
      (value) => {
        if (subscriber.closed) return;
        subscriber.next(value);
        subscriber.complete();
      },
      (err) => subscriber.error(err)
    );
  });
}
