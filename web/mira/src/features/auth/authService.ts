export async function login(email: string, password: string) {
  // Placeholder - integrate with API (password will be used for auth)
  void password;
  return { success: true, user: { email, name: "User" } };
}

export async function logout() {
  // Placeholder - clear session
  return { success: true };
}
