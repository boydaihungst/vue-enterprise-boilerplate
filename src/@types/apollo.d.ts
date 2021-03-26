import { SubscriptionClient } from 'subscriptions-transport-ws';
import { CachePersistor } from 'apollo-cache-persist';

declare module '@apollo/client/core' {
  export interface ApolloClient<TCacheShape> {
    wsClient?: SubscriptionClient;
    gracefullyRestartWebsockets?: () => void;
    cachePersistor?: CachePersistor;
  }
}

export interface ApolloPersistOptions<TSerialized> {
  cache: ApolloCache<TSerialized>;
  storage: PersistentStorage<PersistedData<TSerialized>>;
  trigger?: 'write' | 'background' | TriggerFunction | false;
  debounce?: number;
  key?: string;
  serialize?: boolean;
  maxSize?: number | false;
  debug?: boolean;
}
