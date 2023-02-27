import { Regex } from '@src/constraint/const';
describe('@utils/const', () => {
  it('@utils/const', () => {
    it.todo('test regex....');
    expect(RegExp(Regex.EMAIL).test('example@gmail.com')).toBeTruthy();
  });
});
