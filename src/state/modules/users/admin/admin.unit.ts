import adminModule from './index';

describe('@state/modules/admin/admin', () => {
  it('exports a valid Vuex module', () => {
    expect(adminModule).toBeAVuexModule();
  });
  it.todo('todo test');
});
