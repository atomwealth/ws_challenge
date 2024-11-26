import { test, expect } from "@playwright/test";

const login = async (page) => {
  const usernameInput = await page.locator("input[name='username']");
  await usernameInput.fill("demo");
  const passwordInput = await page.locator("input[name='password']");
  await passwordInput.fill("demo");
  const loginInput = await page.locator("button[name='login']");
  await loginInput.click();
  await page.waitForResponse((response) => response.status() === 200);
};
const logout = async (page) => {
  const loginInput = await page.locator("button[name='logout']");
  await loginInput.click();
};

test("should check if the token is stored in the localStorage before and after login in", async ({
  page,
}) => {
  await page.goto("http://localhost:5173", { waitUntil: "load" });
  let jwtToken = await page.evaluate(() => localStorage.getItem("WSAuthToken"));
  expect(jwtToken).toBeFalsy();
  await login(page);
  jwtToken = await page.evaluate(() => localStorage.getItem("WSAuthToken"));
  expect(jwtToken).toBeTruthy();
  await logout(page);
  jwtToken = await page.evaluate(() => localStorage.getItem("WSAuthToken"));
  expect(jwtToken).toBeFalsy();
});

test("should check if after the login is done, we see the list of students", async ({
  page,
}) => {
  await page.goto("http://localhost:5173", { waitUntil: "load" });
  let students_list = await page.locator("table[data-testId='students_list']");
  expect(await students_list.count()).toEqual(0);
  await login(page);
  students_list = await page.locator("table[data-testId='students_list']");
  await students_list.waitFor({ state: "visible" });
  expect(await students_list.count()).toEqual(1);
});
