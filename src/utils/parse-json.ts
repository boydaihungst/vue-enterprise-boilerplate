export function parseJson<T>(str: string): T | null {
  try {
    return JSON.parse(str);
  } catch (error: unknown) {
    return null;
  }
}
