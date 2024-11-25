import { test, expect } from "@playwright/test";

test("should load the student list", async ({ page }) => {
  await page.goto("http://localhost:5173", { waitUntil: "load" });
  const title = await page.locator("[data-test-id='student_list_title']");
  await expect(title).toHaveText("Fraud detection screener");
});
