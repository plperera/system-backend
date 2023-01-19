export function invalidEmailError(email: string) {
  return {
    name: "InvalidEmailError",
    email: email,
    message: `"${email}" is not a valid email!`,
  };
}

