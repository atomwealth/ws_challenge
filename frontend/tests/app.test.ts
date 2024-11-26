import { test, expect } from "@playwright/test";
import { login, logout } from "./shared";

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
