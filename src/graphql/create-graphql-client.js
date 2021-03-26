import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { setContext } from '@apollo/client/link/context';
import {
  split,
  from,
  ApolloClientOptions,
  Resolvers,
  DocumentNode,
  HttpOptions,
  ApolloClient,
  ApolloLink,
} from '@apollo/client/core';

import { InMemoryCacheConfig, InMemoryCache } from '@apollo/client/cache';
import { CachePersistor } from 'apollo-cache-persist';
import { ApolloPersistOptions } from 'apollo-cache-persist/types';
import { ErrorResponse } from '@apollo/client/link/error';
import hasMultipartData from '@utils/has-multipart-data';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

/**
 * @typedef PersistConfig
 * @property {((document: DocumentNode & {documentId: string}) => string)} generateHash
 * @property {((error: ErrorResponse) => boolean)} [disable]
 * @property {boolean} [useGETForHashedQueries]
 *
 */

/**
 * @typedef ApolloClientConfig
 * @property {string} [clientId]
 * @property {string} httpEndpoint
 * @property {string} [wsEndpoint]
 * @property {string} [tokenName]
 * @property {PersistConfig|boolean} [persisting]
 * @property {boolean} [ssr]
 * @property {boolean} [websocketsOnly]
 * @property {ApolloLink[]} [preAuthLinks]
 * @property {ApolloLink} [link]
 * @property {boolean} [defaultHttpLink]
 * @property {HttpOptions} [httpLinkOptions]
 * @property {InMemoryCache} [cache]
 * @property {InMemoryCacheConfig} [inMemoryCacheOptions]
 * @property {boolean} [cachePersisting]
 * @property {Partial<ApolloPersistOptions<TCacheShape>>} [cachePersistingOptions]
 * @property {Partial<ApolloClientOptions<TCacheShape>>} [apollo]
 * @property {(tokenName: string) => string | void} [getAuth]
 * @property {string | string[] | DocumentNode | DocumentNode[]} [typeDefs]
 * @property {Resolvers | Resolvers[]} [resolvers]
 * @property {(cache: InMemoryCache) => void} [onCacheInit]
 * @template TCacheShape
 *
 */
/**
 *
 * @param {ApolloClientConfig<any>} apolloClientConfig
 * @returns
 */
export function createApolloClient({
  // Client ID if using multiple Clients
  clientId = 'defaultClient',
  // URL to the HTTP API
  httpEndpoint,
  // Url to the Websocket API
  wsEndpoint = null,
  // Token used in localstorage
  tokenName = 'apollo-token',
  // Enable this if you use Query persisting with Apollo Engine
  persisting = false,
  // Is currently Server-Side Rendering or not
  ssr = false,
  // Only use Websocket for all requests (including queries and mutations)
  websocketsOnly = false,
  // Custom starting link.
  // If you want to replace the default HttpLink, set `defaultHttpLink` to false
  link = null,
  // Custom pre-auth links
  // Useful if you want, for example, to set a custom middleware for refreshing an access token.
  preAuthLinks = [],
  // If true, add the default HttpLink.
  // Disable it if you want to replace it with a terminating link using `link` option.
  defaultHttpLink = true,
  // Options for the default HttpLink
  httpLinkOptions = {},
  // Custom Apollo cache implementation (default is apollo-cache-inmemory)
  cache = null,
  // Options for the default cache
  inMemoryCacheOptions = {},
  // apollo-cache-persisting
  cachePersisting = false,
  cachePersistingOptions = {},
  // Additional Apollo client options
  apollo = {},
  // Function returning Authorization header token
  getAuth = defaultGetAuth,
  // Local Schema
  typeDefs = undefined,
  // Local Resolvers
  resolvers = undefined,
  // Hook called when you should write local state in the cache
  onCacheInit = undefined,
}) {
  /** @type {SubscriptionClient} */
  let wsClient;
  /** @type {ApolloLink} */
  let authLink;
  /** @type {CachePersistor<string>} */
  let cachePersistor;
  let gracefullyRestart = () => {};
  /** @type {boolean} */
  const disableHttp = websocketsOnly && !ssr && !!wsEndpoint;

  // Apollo cache
  if (!cache) {
    cache = new InMemoryCache(inMemoryCacheOptions);
  }
  if (cache && cachePersisting) {
    cachePersistor = new CachePersistor({
      cache: cache,
      storage: window.localStorage,
      ...cachePersistingOptions,
    });
  }

  if (!disableHttp) {
    const httpLink = createUploadLink({
      uri: httpEndpoint,
      ...httpLinkOptions,
    });

    if (!link) {
      link = httpLink;
    } else if (defaultHttpLink) {
      link = from([link, httpLink]);
    }

    // HTTP Auth header injection
    authLink = setContext((_, { headers }) => {
      const Authorization = getAuth(tokenName);
      const authorizationHeader = Authorization ? { Authorization } : {};
      return {
        headers: {
          ...headers,
          ...authorizationHeader,
        },
      };
    });

    // Concat all the http link parts
    link = authLink.concat(link);

    if (preAuthLinks.length) {
      link = from(preAuthLinks).concat(link);
    }
  }

  // On the server, we don't want WebSockets and Upload links
  if (!ssr) {
    // If on the client, recover the injected state
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-underscore-dangle
      // @ts-ignore
      const state = window.__APOLLO_STATE__;
      if (state && state[clientId]) {
        // Restore state
        cache.restore(state[clientId]);
      }
    }

    if (!disableHttp) {
      let persistingOpts = null;
      if (typeof persisting === 'object' && persisting != null) {
        persistingOpts = persisting;
        persisting = true;
      }
      if (persisting === true) {
        link = setContext((_, context) => {
          return context;
        }).split(
          (op) => {
            const isMultipartRequest = hasMultipartData(op.variables);
            if (isMultipartRequest) return false;
          },
          createPersistedQueryLink(persistingOpts).concat(link),
          link
        );
      }
    }

    // Web socket
    if (wsEndpoint) {
      wsClient = new SubscriptionClient(wsEndpoint, {
        connectionParams: () => {
          const Authorization = getAuth(tokenName);
          return Authorization
            ? { Authorization, headers: { Authorization } }
            : {};
        },
      });

      // Create the subscription websocket link
      const wsLink = new WebSocketLink(wsClient);

      if (disableHttp) {
        link = link ? link.concat(wsLink) : wsLink;
      } else {
        link = split(
          // split based on operation type
          ({ query }) => {
            // @ts-ignore
            const { kind, operation } = getMainDefinition(query);
            return (
              kind === 'OperationDefinition' && operation === 'subscription'
            );
          },
          wsLink,
          link
        );
      }
    }
  }

  const apolloClient = new ApolloClient({
    link,
    cache,
    // Additional options
    ...(ssr
      ? {
          // Set this on the server to optimize queries when SSR
          ssrMode: true,
        }
      : {
          // This will temporary disable query force-fetching
          ssrForceFetchDelay: 100,
          // Apollo devtools
          connectToDevTools: process.env.NODE_ENV !== 'production',
        }),
    typeDefs,
    resolvers,
    ...apollo,
  });

  if (onCacheInit) {
    onCacheInit(cache);
    apolloClient.onResetStore(async () => {
      if (cachePersistor) await cachePersistor?.purge();
      onCacheInit(cache);
    });
  }
  if (wsClient) {
    apolloClient.wsClient = wsClient;
    apolloClient.gracefullyRestartWebsockets = () =>
      restartWebsockets(wsClient);
  }
  return {
    apolloClient,
    cachePersistor,
  };
}

export function restartWebsockets(wsClient) {
  // Copy current operations
  const operations = { ...wsClient.operations };

  // Close connection
  wsClient.close(true);

  // Open a new one
  wsClient.connect();

  // Push all current operations to the new connection
  Object.keys(operations).forEach((id) => {
    wsClient.sendMessage(id, MessageTypes.GQL_START, operations[id].options);
  });
}
/**
 *
 * @param {string} tokenName
 * @returns Bearer + `ACCESS TOKEN` | ''
 */
function defaultGetAuth(tokenName) {
  if (typeof window !== 'undefined') {
    // get the authentication token from local storage if it exists
    const token = window.localStorage.getItem(tokenName);
    // return the headers to the context so httpLink can read them
    return token ? `Bearer ${token}` : '';
  }
  return '';
}
