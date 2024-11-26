export const login = async (page) => {
  const usernameInput = await page.locator("input[name='username']");
  await usernameInput.fill("demo");
  const passwordInput = await page.locator("input[name='password']");
  await passwordInput.fill("demo");
  const loginInput = await page.locator("button[name='login']");
  await loginInput.click();
  await page.waitForResponse((response) => response.status() === 200);
};

export const logout = async (page) => {
  const loginInput = await page.locator("button[name='logout']");
  await loginInput.click();
};
