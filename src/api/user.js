import {
  FetchResult,
  MutationOptions,
  QueryOptions,
  SubscriptionOptions,
  Observable,
  ApolloQueryResult,
} from '@apollo/client/core';
import { Mutation, LoginInput, Query, Subscription } from '@graphql/jsDoc';
import MutationAccountLogin from '@graphql/account/MutationAccountLogin.graphql';
import QueryCurrentUserInfo from '@graphql/account/QueryCurrentUserInfo.graphql';
import QueryUser from '@graphql/account/QueryUser.graphql';
import QueryAccessTokenValidation from '@graphql/account/QueryAccessTokenValidation.graphql';
import SubscriptionUserInfoChange from '@graphql/account/SubscriptionUserInfoChange.graphql';

import { apolloProvider, apolloHelpers } from '@plugin/vue-apollo';

//#region Mutation
/**
 *
 * @param {LoginInput} payload
 * @param {Partial<MutationOptions<Mutation, {payload: LoginInput}>>} [options={}]
 */
export async function mutationAccountLogin(payload, options = {}) {
  /** @type {FetchResult<Mutation>} */
  const result = await apolloProvider.defaultClient.mutate({
    mutation: MutationAccountLogin,
    variables: {
      payload,
    },
    ...options,
  });
  return result.data.login;
}
//#endregion

//#region Query
/**
 *
 * @param {Partial<QueryOptions<Query, {}>>} [options={}]
 */
export async function queryCurrentUserInfo(options = {}) {
  /** @type {ApolloQueryResult<Query>} */
  const result = await apolloProvider.defaultClient.query({
    query: QueryCurrentUserInfo,
    fetchPolicy: 'cache-first',
    ...options,
  });
  return result.data.currentUser;
}

/**
 *
 * @param {Partial<QueryOptions<Query, {}>>} [options={}]
 */
export async function queryUserInfo(options = {}) {
  /** @type {ApolloQueryResult<Query>} */
  const result = await apolloProvider.defaultClient.query({
    query: QueryUser,
    fetchPolicy: 'cache-first',
    ...options,
  });
  return result.data.currentUser;
}

/**
 *
 * @param {Partial<QueryOptions<Query, {}>>} [options={}]
 */
export async function queryAccessTokenValidation(options = {}) {
  /** @type {ApolloQueryResult<Query>} */
  const result = await apolloProvider.defaultClient.query({
    query: QueryAccessTokenValidation,
    fetchPolicy: 'network-only',
    ...options,
  });
  return result.data.accessTokenValidation;
}
//#endregion

//#region Subscription
/**
 *
 * @param {Partial<SubscriptionOptions<Subscription, {}>>} [options={}]
 */
export function subscribeCurrentUserChanged(options = {}) {
  /** @type {Observable<FetchResult<Subscription>>} */
  const observable = apolloProvider.defaultClient.subscribe({
    query: SubscriptionUserInfoChange,
    fetchPolicy: 'cache-first',
    ...options,
  });
  return observable;
}
//#endregion
