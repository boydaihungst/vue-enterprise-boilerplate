// import { mergeResolvers } from '@graphql-tools/merge';
// import concat from 'lodash/concat';
import { UserTypeDefs } from './account';
import { ApolloClientConfig } from './create-graphql-client';
import { FileManagerTypeDefs } from './file-manager';

/** @type {Partial<ApolloClientConfig<any>>} */
export const apolloLocalStateConfig = {
  typeDefs: [UserTypeDefs, FileManagerTypeDefs],
  onCacheInit: (cache) => {
    // const defaultStates = concat(UserDefaultState, FileManagerDefaultState);
    // defaultStates.forEach((state) => {
    //   cache.writeQuery(state);
    // });
  },
};
