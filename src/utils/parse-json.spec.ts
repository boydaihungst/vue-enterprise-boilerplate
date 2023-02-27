import { parseJson } from '@utils/parse-json';

describe('@utils/parse-json', () => {
  it('should parses valid string to object', () => {
    const expectedObject = {
      param1: 'value1',
      param2: 'value2',
    };
    const dataToParse = JSON.stringify(expectedObject);

    const receivedObject = parseJson(dataToParse);

    expect(receivedObject).toEqual(expectedObject);
  });
  it('should return null if parses invalid string', () => {
    const dataToParse = 'invalid string';

    expect(parseJson(dataToParse)).toBeNull();
  });
});
