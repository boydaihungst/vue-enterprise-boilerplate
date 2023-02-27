import UsersMocked from '@tests/mock-api/resources/users';
import axios from 'axios';
import { setActivePinia } from 'pinia';
import { useUserStore } from './user.module';

const validUserExample = UsersMocked.findBy('username', 'admin');

describe('@stores/user.module', () => {
  describe('in a store when logged in', () => {
    beforeEach(async () => {
      // creates a fresh pinia and make it active so it's automatically picked
      // up by any useStore() call without having to pass it to it:
      // `useStore(pinia)`
      const store = await createModuleStore({
        stubActions: false,
        currentUser: validUserExample,
      });

      setActivePinia(store);
      window.localStorage.clear();
    });
    it('actions.fetchUser returns the current user without fetching it again', async () => {
      const originalAxiosGet = axios.get;
      const store = useUserStore();

      axios.get = vi.fn();
      const user = await store.fetchUser({
        username: validUserExample?.username || 'admin',
      });

      expect(user).toEqual(validUserExample);
      expect(axios.get).not.toHaveBeenCalled();
      axios.get = originalAxiosGet;
    });

    it('actions.fetchUser rejects with 400 when provided a bad username', async () => {
      try {
        const store = useUserStore();

        await store.fetchUser({
          username: 'invalid-username',
        });
      } catch (error: any) {
        expect(error.response.status).toEqual(400);
      }
    });
  });
});

describe('in a store when logged out', () => {
  beforeEach(async () => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    const store = await createModuleStore({
      stubActions: false,
      currentUser: undefined,
    });

    setActivePinia(store);
    window.localStorage.clear();
  });
  it('actions.fetchUser rejects with 401', async () => {
    try {
      const store = useUserStore();

      await store.fetchUser({ username: 'admin' });
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });
});
