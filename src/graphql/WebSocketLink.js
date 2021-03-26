import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from '@apollo/client/core';
import { print, GraphQLError } from 'graphql';
import { Client } from 'graphql-ws';

export class WebSocketLink extends ApolloLink {
  // client;

  /**
   *
   * @param {Client} client
   */
  constructor(client) {
    super();
    this.client = client;
  }

  /**
   *
   * @param {Operation} operation
   * @returns {Observable<FetchResult>}
   */
  request(operation) {
    return new Observable((sink) => {
      return this.client.subscribe(
        { ...operation, query: print(operation.query) },
        /** @type {Sink<FetchResult>} */
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          /**
           *
           * @param {GraphQLError[] | Error | CloseEvent} err
           * @returns
           */
          error: (err) => {
            if (err instanceof Error) {
              return sink.error(err);
            }

            if (err instanceof CloseEvent) {
              return sink.error(
                new Error(
                  `Socket closed with event ${err.code} ${err.reason || ''}`
                )
              );
            }

            return sink.error(
              new Error(err.map(({ message }) => message).join(', '))
            );
          },
        }
      );
    });
  }
}
