export function requestError(status: number, name: string) {
  return {
    status,
    name,
  };
}
