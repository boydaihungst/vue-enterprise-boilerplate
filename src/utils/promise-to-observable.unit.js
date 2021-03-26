import { Observable } from '@apollo/client/core';
import promiseToObservable from './promise-to-observable';

describe('@utils/promise-to-observable', () => {
  it('says hello', () => {
    const promiseParam = new Promise((resolve, reject) => {});
    const result = promiseToObservable(promiseParam);
    expect(result).toEqual('hello');
  });
});
