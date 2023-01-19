export function requestError(status: number, statusText: string) {
  return {
    name: "RequestError",
    status,
    statusText,
    message: "No result for this search!",
  };
}
