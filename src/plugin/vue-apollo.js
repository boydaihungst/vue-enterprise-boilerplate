import Vue from 'vue';
import { fromPromise, ApolloClient, FetchResult } from '@apollo/client/core';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import VueApollo from '@vue/apollo-option';
import { AuthorizedToken, RenewTokenInput, Mutation } from '@graphql/jsDoc';
import {
  ApolloClientConfig,
  createApolloClient,
} from '@graphql/create-graphql-client';
import { apolloLocalStateConfig } from '@graphql';
import fragmentMatcher from '@graphql/possibleTypes';

import MutationAccountTokenRenew from '@graphql/account/MutationAccountTokenRenew.graphql';

Vue.use(VueApollo);
const AUTH_TOKEN = 'apollo-token';
const SCHEMA_VERSION = '1';
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP;

const wsEndpoint = process.env.VUE_APP_GRAPHQL_WS;
/** @type {VueApollo} */
let apolloProvider;
/** @type {import('../@types/vue').ApolloHelperTypes} */
let apolloHelpers;
let isRefreshing = false;
/** @type {Function[]} */
let pendingRequests = [];

/**
 * @type {ApolloClientConfig<any>}
 */
const defaultOptions = {
  httpEndpoint,
  wsEndpoint: wsEndpoint,
  tokenName: AUTH_TOKEN,
  persisting: true,
  websocketsOnly: false,
  ssr: false,
  httpLinkOptions: {
    // credentials: 'include',
  },
  inMemoryCacheOptions: {
    possibleTypes: fragmentMatcher.possibleTypes,
  },
};

/**
 *
 * @param {boolean} value
 */
const setIsRefreshing = (value) => {
  isRefreshing = value;
};

/**
 *
 * @param {Function} pendingRequest
 */
const addPendingRequest = (pendingRequest) => {
  pendingRequests.push(pendingRequest);
};

/**
 *
 */
const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const install = () => {
  /**
   *
   * @param {string} [tokenName]
   * @returns {AuthorizedToken}
   */
  const getTokens = (tokenName = AUTH_TOKEN) => {
    if (typeof localStorage !== 'undefined') {
      const tokens = JSON.parse(localStorage.getItem(tokenName));
      return tokens;
    }
  };

  /**
   *
   * @param {string} [tokenName]
   * @returns
   */
  const getRefreshToken = (tokenName = AUTH_TOKEN) => {
    const token = getTokens(tokenName)?.refresh?.token;
    return token;
  };

  /**
   *
   * @param {string} [tokenName]
   * @returns
   */
  const getAuth = (tokenName = AUTH_TOKEN) => {
    try {
      const token = getTokens(tokenName)?.access?.token;
      return token ? `Bearer ${token}` : '';
    } catch (error) {
      return '';
    }
  };

  /**
   *
   * @param {ApolloClient<any>} apolloClient
   * @param {string} refreshToken
   * @returns {Promise<any>}
   */
  const renewTokens = async (apolloClient, refreshToken) => {
    if (!refreshToken) {
      return null;
    }
    /** @type {FetchResult<Mutation>} */
    const result = await apolloClient.mutate({
      mutation: MutationAccountTokenRenew,
      variables: {
        /** @type {RenewTokenInput} */
        payload: {
          refreshToken,
        },
      },
    });
    return onLogin(result.data.renewToken, apolloClient);
  };

  /**
   * Manually call this when user log in
   * @param {AuthorizedToken} token
   * @param {ApolloClient<any>} apolloClient
   */
  const onLogin = async (token, apolloClient) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    }
    if (apolloClient.wsClient) apolloClient.gracefullyRestartWebsockets();
    try {
      await apolloClient.resetStore();
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.log('%cError on cache reset (login)', 'color: orange;', e.message);
    }
  };

  /**
   * Manually call this when user log out
   * @param {ApolloClient<any>} apolloClient
   */
  const onLogout = async (apolloClient) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN);
    }
    if (apolloClient.wsClient) apolloClient.gracefullyRestartWebsockets();
    try {
      await apolloClient.resetStore();
    } catch (e) {
      // eslint-disable-next-line no-console
      // console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
    }
    pendingRequests = [];
    setIsRefreshing(false);
    window.location.reload();
  };

  /**
   * Handle retry query when network has problem
   */
  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (errors, _operation) =>
        errors?.message === 'NetworkError when attempting to fetch resource.',
    },
  });

  /**
   * Handle when error happens
   */
  const onErrorLink = onError(
    ({ graphQLErrors, networkError, operation, response, forward }) => {
      if (graphQLErrors) {
        if (
          ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(
            graphQLErrors[0].message
          )
        ) {
          if (!isRefreshing) {
            setIsRefreshing(true);
            const refreshToken = getRefreshToken(AUTH_TOKEN);

            return fromPromise(
              renewTokens(apolloProvider.defaultClient, refreshToken)
            ).flatMap(() => {
              resolvePendingRequests();
              setIsRefreshing(false);
              return forward(operation);
            });
          }
          return fromPromise(
            new Promise((resolve) => {
              addPendingRequest(() => resolve(undefined));
            })
          ).flatMap(() => forward(operation));
        }
      }
    }
  );

  /**
   *
   * @param {Partial<ApolloClientConfig<any>>} [options={}]
   * @returns {VueApollo}
   */
  const createProvider = (options = {}) => {
    // Create apollo client
    const { apolloClient, cachePersistor } = createApolloClient({
      ...defaultOptions,
      ...options,
    });
    apolloClient.cachePersistor = cachePersistor;
    // we tell Vue to use our Vue package:

    // Create vue apollo provider
    return new VueApollo({
      defaultClient: apolloClient,
      defaultOptions: {
        $query: {
          // fetchPolicy: 'cache-and-network',
        },
      },
      async errorHandler({ message }) {
        if (message === 'NetworkError when attempting to fetch resource.') {
          // TODO: show notify
          // Notify.create({
          //   type: 'warning',
          //   icon: mdiNetworkStrengthOffOutline,
          //   message: i18n
          //     .t('NetworkError when attempting to fetch resource.')
          //     .toString(),
          //   progress: true,
          //   group: 'error-network',
          //   closeBtn: true,
          // });
        }
        if (
          [
            'RefreshTokenExpiredError',
            'RefreshJsonWebTokenError',
            'RefreshNotBeforeError',
          ].includes(message)
        ) {
          await onLogout(apolloClient);
        }
      },
    });
  };

  apolloProvider = createProvider({
    ...defaultOptions,
    getAuth,
    preAuthLinks: [retryLink, onErrorLink],
    apollo: {
      defaultOptions: {
        mutate: {
          fetchPolicy: 'no-cache',
        },
        query: {
          fetchPolicy: 'cache-first',
        },
      },
      connectToDevTools: process.env.NODE_ENV === 'development',
      version: SCHEMA_VERSION,
    },
    persisting: {
      generateHash: ({ documentId }) => documentId,
      useGETForHashedQueries: true,
    },
    ...apolloLocalStateConfig,
  });
  apolloHelpers = {
    getToken: getAuth,
    onLogin: (token, client) =>
      onLogin(token, client || apolloProvider.defaultClient),
    onLogout: (client) => onLogout(client || apolloProvider.defaultClient),
    getRefreshToken,
    renewTokens,
  };
  Vue.prototype.$apolloHelpers = apolloHelpers;
};

export { install, apolloProvider, apolloHelpers, AUTH_TOKEN };
