export function invalidDataError(details: string[]) {
  return {
    name: "InvalidDataError",
    message: "Invalid data",
    details,
  };
}

