import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("exibe a tela inicial com todos os controles e sem resultados", async ({ page }) => {
  await expect(page).toHaveTitle("Validador de CPF e CNPJ");
  await expect(page.getByRole("heading", { name: "CPF e CNPJ", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Geradores", exact: true })).toBeVisible();
  await expect(page.getByLabel("Documento", { exact: true })).toBeEmpty();
  await expect(page.getByLabel("Documento", { exact: true })).toHaveAttribute("aria-invalid", "false");
  await expect(page.getByText("Você pode digitar com ou sem pontuação.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Validar documento", exact: true })).toBeDisabled();
  await expect(page.getByRole("radio", { name: "Com máscara", exact: true })).toBeChecked();
  await expect(page.getByRole("radio", { name: "Sem máscara", exact: true })).not.toBeChecked();
  await expect(page.getByRole("region", { name: "Geradores" }).getByRole("button")).toHaveCount(3);
  await expect(page.getByRole("button", { name: /^CPF Gera/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^CNPJ numérico Gera/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^CNPJ alfanumérico Gera/ })).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Copiar", exact: true })).toHaveCount(0);
});

test("permite alternar as opções de máscara de forma exclusiva", async ({ page }) => {
  const comMascara = page.getByRole("radio", { name: "Com máscara", exact: true });
  const semMascara = page.getByRole("radio", { name: "Sem máscara", exact: true });
  await semMascara.check();
  await expect(semMascara).toBeChecked();
  await expect(comMascara).not.toBeChecked();
  await comMascara.check();
  await expect(comMascara).toBeChecked();
  await expect(semMascara).not.toBeChecked();
});

test("permite acessar o campo e validar pelo teclado com Enter", async ({ page }) => {
  await page.keyboard.press("Tab");
  const campo = page.getByLabel("Documento", { exact: true });
  await expect(campo).toBeFocused();
  await campo.fill("123.456.789-09");
  await campo.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Documento válido — CPF.");
  await expect(page).toHaveURL("/");
});

test("permite selecionar o formato e gerar usando o teclado", async ({ page }) => {
  const formato = page.getByRole("radio", { name: "Com máscara", exact: true });
  await formato.focus();
  await formato.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Sem máscara", exact: true })).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /^CPF Gera/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("CPF gerado sem máscara");
  await expect(page.getByRole("status").getByRole("code")).toHaveText(/^\d{11}$/);
});

test("mantém os controles e o resultado dentro da largura da tela", async ({ page }) => {
  await page.getByRole("button", { name: /^CNPJ alfanumérico Gera/ }).click();
  await expect(page.getByRole("status").getByRole("code")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar", exact: true })).toBeVisible();
  const largura = await page.evaluate(() => ({
    conteudo: document.documentElement.scrollWidth,
    tela: document.documentElement.clientWidth,
  }));
  expect(largura.conteudo).toBeLessThanOrEqual(largura.tela);
});

test("restaura o estado inicial ao recarregar a página", async ({ page }) => {
  await page.getByRole("radio", { name: "Sem máscara", exact: true }).check();
  await page.getByRole("button", { name: /^CPF Gera/ }).click();
  await page.getByLabel("Documento", { exact: true }).fill("12345678909");
  await page.getByRole("button", { name: "Validar documento", exact: true }).click();
  await expect(page.getByRole("status")).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel("Documento", { exact: true })).toBeEmpty();
  await expect(page.getByRole("button", { name: "Validar documento", exact: true })).toBeDisabled();
  await expect(page.getByRole("radio", { name: "Com máscara", exact: true })).toBeChecked();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
});
