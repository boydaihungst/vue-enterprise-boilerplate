import { VuexStore } from 'vuex';
import axios from 'axios';
import UsersMocked from '@/tests/mock-api/resources/users';
import usersModule, {
  UsersActions,
  UsersGetters,
  UsersMutations,
  UsersStates,
} from './index';

describe('@state/modules/users', () => {
  it('exports a valid Vuex module', () => {
    expect(usersModule).toBeAVuexModule();
  });

  describe('in a store when logged in', () => {
    let store: VuexStore<
      UsersStates,
      UsersGetters,
      UsersActions,
      UsersMutations
    >;
    beforeEach(() => {
      store = createModuleStore(usersModule, {
        currentUser: validUserExample,
      });
    });

    it('actions.fetchUser returns the current user without fetching it again', async () => {
      const originalAxiosGet = axios.get;
      axios.get = jest.fn();

      const user = await store.dispatch('fetchUser', { username: 'admin' });
      expect(user).toEqual(validUserExample);
      expect(axios.get).not.toHaveBeenCalled();
      axios.get = originalAxiosGet;
    });

    it('actions.fetchUser rejects with 400 when provided a bad username', async () => {
      try {
        return await store.dispatch('fetchUser', { username: 'bad-username' });
      } catch (error) {
        expect(error.response.status).toEqual(400);
      }
    });
  });

  describe('in a store when logged out', () => {
    let store: VuexStore<
      UsersStates,
      UsersGetters,
      UsersActions,
      UsersMutations
    >;
    beforeEach(() => {
      store = createModuleStore(usersModule);
    });

    it('actions.fetchUser rejects with 401', async () => {
      try {
        return await store.dispatch('fetchUser', { username: 'admin' });
      } catch (error) {
        expect(error.response.status).toEqual(401);
      }
    });
  });
});

const validUserExample = UsersMocked.findBy('username', 'admin');
