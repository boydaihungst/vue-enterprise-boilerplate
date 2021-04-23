import axios from 'axios';
import { VuexStore } from 'vuex';
import UsersMocked from '@/tests/mock-api/resources/users';
import authModule, {
  AuthGetters,
  AuthActions,
  AuthMutations,
  AuthStates,
} from './index';

describe('@state/modules/auth', () => {
  it('exports a valid Vuex module', () => {
    expect(authModule).toBeAVuexModule();
  });

  describe('in a store', () => {
    let store: VuexStore<AuthStates, AuthGetters, AuthActions, AuthMutations>;
    beforeEach(() => {
      store = createModuleStore(authModule);
      window.localStorage.clear();
    });
    it('mutations.SET_CURRENT_USER correctly sets axios default authorization header', () => {
      axios.defaults.headers.common.Authorization = '';

      store.commit('SET_CURRENT_USER', { token: 'some-token' });
      expect(axios.defaults.headers.common.Authorization).toEqual('some-token');

      store.commit('SET_CURRENT_USER', null);
      expect(axios.defaults.headers.common.Authorization).toEqual('');
    });

    // it('mutations.SET_CURRENT_USER correctly saves currentUser in localStorage', () => {
    //   expect(store.state.currentUser).toEqual(null);

    //   const expectedCurrentUser = { token: 'some-token' };
    //   store.commit('SET_CURRENT_USER', expectedCurrentUser);
    //   expect(window.localStorage.length).toEqual(1);
    // });

    it('getters.loggedIn returns true when currentUser is an object', () => {
      store.commit('SET_CURRENT_USER', {});
      expect(store.getters.loggedIn).toEqual(true);
    });

    it('getters.loggedIn returns false when currentUser is null', () => {
      store.commit('SET_CURRENT_USER', null);
      expect(store.getters.loggedIn).toEqual(false);
    });

    it('actions.logIn resolves to a refreshed currentUser when already logged in', async () => {
      store.commit('SET_CURRENT_USER', { token: validUserExample?.token });
      const user = await store.dispatch('logIn');
      expect(user).toEqual(validUserExample);
      expect(store.state.currentUser).toEqual(validUserExample);
    });

    it('actions.logIn throw error when already logged out and not input username and password', async () => {
      try {
        await store.dispatch('logIn');
      } catch (error) {
        expect(error.message).toEqual('Must input username and password');
      }
    });

    it(`actions.logIn commits the currentUser and resolves to the user
    when NOT already logged in and provided a
    correct username and password`, async () => {
      const user = await store.dispatch('logIn', {
        username: 'admin',
        password: 'password123',
      });
      expect(user).toEqual(validUserExample);
      expect(store.state.currentUser).toEqual(validUserExample);
    });

    it(`actions.logIn rejects with 401 when NOT already logged in and
    provided an incorrect username and password`, async () => {
      try {
        await store.dispatch('logIn', {
          username: 'bad username',
          password: 'bad password',
        });
      } catch (error) {
        expect(error.message).toEqual('Request failed with status code 401');
      }
    });

    it('actions.validate resolves to null when currentUser is null', async () => {
      store.commit('SET_CURRENT_USER', null);
      const user = await store.dispatch('validate');
      expect(user).toEqual(null);
    });

    it('actions.validate resolves to null when currentUser contains an invalid token', async () => {
      store.commit('SET_CURRENT_USER', { token: 'invalid-token' });
      const user = await store.dispatch('validate');
      expect(user).toEqual(null);
      expect(store.state.currentUser).toEqual(null);
    });

    it('actions.validate resolves to a user when currentUser contains a valid token', async () => {
      store.commit('SET_CURRENT_USER', { token: validUserExample?.token });
      const user = await store.dispatch('validate');
      expect(user).toEqual(validUserExample);
      expect(store.state.currentUser).toEqual(validUserExample);
    });
  });
});

const validUserExample = UsersMocked.findBy('username', 'admin');
