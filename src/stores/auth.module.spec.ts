import { PersistStateKey } from '@src/constraint/const';
import { useAuthStore } from '@stores/auth.module';
import UsersMocked from '@tests/mock-api/resources/users';
import { flushPromises } from '@vue/test-utils';
import axios from 'axios';
import { setActivePinia, storeToRefs } from 'pinia';

const validUserExample = UsersMocked.findBy('username', 'admin');

describe('@stores/auth.module', () => {
  beforeEach(async () => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    const store = await createModuleStore({
      stubActions: false,
    });

    setActivePinia(store);
    window.localStorage.clear();
  });

  it('will correctly sets axios default authorization header after change user token', async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    axios.defaults.headers.common.Authorization = '';

    currentUser.value = {
      token: 'some-token',
    };
    await flushPromises();
    expect(axios.defaults.headers.common.Authorization).toEqual('some-token');

    currentUser.value = {
      token: '',
    };
    await flushPromises();
    expect(axios.defaults.headers.common.Authorization).toEqual('');
  });

  it('will correctly saves current user info to localstorage', async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    expect(currentUser.value).toEqual(undefined);
    const expectedCurrentUser = { token: 'some-token' };

    currentUser.value = expectedCurrentUser;
    await flushPromises();
    expect(window.localStorage.getItem(PersistStateKey.user)).not.toBeNull();
  });
  it('getter loggedIn returns true when currentUser is an object', () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = {};
    expect(store.loggedIn).toBeTruthy();
  });
  it('getter loggedIn returns false when currentUser is null', () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = null;
    expect(store.loggedIn).toBeFalsy();
  });
  it('action logIn resolves to a refreshed currentUser when already logged in', async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = { token: validUserExample?.token };
    await flushPromises();

    const user = await store.logIn();

    expect(user).toEqual(validUserExample);
    expect(currentUser.value).toEqual(validUserExample);
  });
  it('action logIn throw error when already logged out and not input username and password', async () => {
    try {
      const store = useAuthStore();
      const { currentUser } = storeToRefs(store);

      currentUser.value = null;

      await store.logIn();
    } catch (error: any) {
      expect(error.message).toEqual('Must input username and password');
    }
  });
  it(`action logIn commits the currentUser and resolves to the user
    when NOT already logged in and provided a
    correct username and password`, async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = null;
    await flushPromises();
    const user = await store.logIn({
      username: validUserExample?.username || '',
      password: validUserExample?.password || '',
    });

    await flushPromises();
    expect(user).toEqual(validUserExample);
    expect(currentUser.value).toEqual(validUserExample);
  });
  it(`action logIn rejects with 401 when NOT already logged in and
    provided an incorrect username and password`, async () => {
    try {
      const store = useAuthStore();
      const { currentUser } = storeToRefs(store);

      currentUser.value = null;
      await store.logIn({
        username: 'bad information',
        password: 'bad information',
      });
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 401');
    }
  });
  it('action validate resolves to null when currentUser is null', async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = null;
    await flushPromises();

    const user = await store.validate();

    expect(user).toEqual(null);
  });

  it('action validate resolves to null when currentUser contains an invalid token', async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = { token: 'invalid-token' };
    await flushPromises();

    const user = await store.validate();

    expect(user).toEqual(null);
    expect(currentUser.value).toEqual(null);
  });

  it('action validate resolves to a user when currentUser contains a valid token', async () => {
    const store = useAuthStore();
    const { currentUser } = storeToRefs(store);

    currentUser.value = { token: validUserExample?.token };
    await flushPromises();
    const user = await store.validate();

    expect(user).toEqual(validUserExample);
    expect(currentUser.value).toEqual(validUserExample);
  });
});
