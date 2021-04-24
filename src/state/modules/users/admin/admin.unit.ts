import adminModule from './index';

describe('@state/modules/users/admin/admin', () => {
  it('exports a valid Vuex module', () => {
    expect(adminModule).toBeAVuexModule();
  });
  it.todo('should be implemented');
});
