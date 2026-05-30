import { expect, test } from "@playwright/test";

test("deve exibir a tela principal", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "CPF e CNPJ" })
  ).toBeVisible();

  await expect(page.getByLabel("Documento")).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Validar documento" })
  ).toBeVisible();
});