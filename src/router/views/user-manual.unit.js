import UserManual from './user-manual';

describe('@views/user-manual', () => {
  it('is a valid view', () => {
    expect(UserManual).toBeAViewComponent();
  });
});
