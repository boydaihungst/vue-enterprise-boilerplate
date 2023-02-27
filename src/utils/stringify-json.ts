export function stringifyJson<T>(obj: T) {
  try {
    return JSON.stringify(obj);
  } catch (error: unknown) {
    return null;
  }
}
