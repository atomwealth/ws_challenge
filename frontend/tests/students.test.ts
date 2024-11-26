import { test, expect } from "@playwright/test";
import { login, logout } from "./shared";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173", { waitUntil: "load" });
  await login(page);
});
test("should check if after the login is done, we see the list of students", async ({
  page,
}) => {
  await logout(page);
  let students_list = await page.getByTestId("students_list");
  expect(await students_list.count()).toEqual(0);
  await login(page);
  students_list = await page.getByTestId("students_list");
  await students_list.waitFor({ state: "visible" });
  expect(await students_list.count()).toEqual(1);
});

test("should see students details when click from the list", async ({
  page,
}) => {
  await page
    .getByTestId("students_list")
    .getByRole("cell", { name: "Jon" })
    .click();
  const studentDetailTable = await page.getByTestId("student_detail");
  await studentDetailTable.waitFor({ state: "visible" });
  expect(await studentDetailTable.count()).toEqual(1);

  const studentDetailChart = await page.getByTestId("student_chart");
  await studentDetailChart.waitFor({ state: "visible" });
  expect(await studentDetailChart.count()).toEqual(1);
});
