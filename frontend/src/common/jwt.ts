export const setToken = (token: string): void => {
  localStorage.setItem("WSAuthToken", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("WSAuthToken");
};

export const removeToken = (): void => {
  localStorage.removeItem("WSAuthToken");
};
