import { stringifyJson } from '@utils/stringify-json';

describe('@utils/parse-json', () => {
  it('should convert valid object to string', () => {
    const dataToConvert = {
      param1: 'value1',
      param2: 'value2',
    };
    const arrayToConvert = ['value1', 'value2'];

    expect(stringifyJson(dataToConvert)).toEqual(JSON.stringify(dataToConvert));
    expect(stringifyJson(arrayToConvert)).toEqual(
      JSON.stringify(arrayToConvert),
    );
  });
});
