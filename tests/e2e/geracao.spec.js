import { expect, test } from "@playwright/test";
import { documentos, formatos } from "./data/documentos.js";

// Chromium usa a área de transferência real, com permissão no contexto isolado.
test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test.beforeEach(async ({ page }) => {
  // Torna a geração reproduzível e permite comparar gerações sucessivas.
  // Os geradores e validadores reais continuam sendo executados pelo navegador.
  await page.addInitScript(() => {
    let semente = 42;
    Math.random = () => {
      semente = (Math.imul(semente, 1664525) + 1013904223) >>> 0;
      return semente / 4294967296;
    };
  });
  await page.goto("/");
});

for (const documento of documentos) {
  test.describe(documento.tipo, () => {
    for (const formato of formatos) {
      test(`gera ${formato.nome} e valida o documento pela interface`, async ({ page }) => {
        await page.getByRole("radio", { name: new RegExp(`^${formato.nome}$`, "i") }).check();
        await page.getByRole("button", { name: documento.botao }).click();
        const resultado = page.getByRole("status");
        const codigo = resultado.getByRole("code");
        await expect(resultado).toContainText(`${documento.tipo} gerado ${formato.nome}`);
        await expect(codigo).toHaveText(documento[formato.padrao]);
        const valor = await codigo.innerText();
        if (documento.tipo === "CNPJ alfanumérico") {
          expect(valor).toMatch(/[A-Z]/);
        }
        await expect(page.getByLabel("Documento", { exact: true })).toBeEmpty();
        await expect(page.getByRole("button", { name: "Validar documento", exact: true })).toBeDisabled();
        await page.getByLabel("Documento", { exact: true }).fill(valor);
        await page.getByRole("button", { name: "Validar documento", exact: true }).click();
        await expect(page.getByRole("status").filter({ hasText: "Documento válido" })).toHaveText(
          `Documento válido — ${documento.tipo}.`,
        );
        await expect(codigo).toHaveText(valor);
        await expect(page.getByRole("alert")).toHaveCount(0);
      });

      test(`copia ${formato.nome} e permite gerar e copiar outro documento`, async ({ page }) => {
        await page.getByRole("radio", { name: new RegExp(`^${formato.nome}$`, "i") }).check();
        const gerar = page.getByRole("button", { name: documento.botao });
        await gerar.click();
        const codigo = page.getByRole("status").getByRole("code");
        const primeiro = await codigo.innerText();
        await page.getByRole("button", { name: "Copiar", exact: true }).click();
        await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeVisible();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(primeiro);
        await gerar.click();
        await expect(codigo).not.toHaveText(primeiro);
        await expect(codigo).toHaveText(documento[formato.padrao]);
        await expect(page.getByRole("status")).toHaveCount(1);
        await expect(page.getByRole("button", { name: "Copiado", exact: true })).toHaveCount(0);
        const segundo = await codigo.innerText();
        const copiar = page.getByRole("button", { name: "Copiar", exact: true });
        await copiar.focus();
        await copiar.press("Enter");
        await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeVisible();
        await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(segundo);
      });
    }
  });
}

test("substitui o resultado ao alternar entre os três geradores", async ({ page }) => {
  for (const documento of documentos) {
    await page.getByRole("button", { name: documento.botao }).click();
    await expect(page.getByRole("status")).toHaveCount(1);
    await expect(page.getByRole("status")).toContainText(`${documento.tipo} gerado com máscara`);
    await expect(page.getByRole("status").getByRole("code")).toHaveText(documento.padraoComMascara);
  }
});

test("aplica a nova máscara somente na próxima geração", async ({ page }) => {
  const gerar = page.getByRole("button", { name: /^CPF Gera/ });
  await gerar.click();
  const resultado = page.getByRole("status");
  const codigo = resultado.getByRole("code");
  const primeiro = await codigo.innerText();
  await page.getByRole("button", { name: "Copiar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "Sem máscara", exact: true }).check();
  await expect(codigo).toHaveText(primeiro);
  await expect(resultado).toContainText("CPF gerado com máscara");
  await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeVisible();
  await gerar.click();
  await expect(codigo).toHaveText(/^\d{11}$/);
  await expect(resultado).toContainText("CPF gerado sem máscara");
  await expect(page.getByRole("button", { name: "Copiar", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: "Com máscara", exact: true }).check();
  await gerar.click();
  await expect(codigo).toHaveText(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  await expect(resultado).toContainText("CPF gerado com máscara");
});

for (const [nome, valor, role] of [
  ["erro", "12345678900", "alert"],
  ["sucesso", "12345678909", "status"],
]) {
  test(`limpa o feedback de ${nome} ao gerar sem alterar o campo digitado`, async ({ page }) => {
    const campo = page.getByLabel("Documento", { exact: true });
    await campo.fill(valor);
    await campo.press("Enter");
    await expect(page.getByRole(role)).toBeVisible();
    await page.getByRole("button", { name: /^CPF Gera/ }).click();
    await expect(page.getByRole("status")).toHaveCount(1);
    await expect(page.getByRole("status")).toContainText("CPF gerado com máscara");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(campo).toHaveValue(valor);
    await expect(campo).toHaveAttribute("aria-invalid", "false");
  });
}

test("preserva o documento gerado e o estado de cópia ao editar o campo de validação", async ({ page }) => {
  await page.getByRole("button", { name: /^CNPJ alfanumérico Gera/ }).click();
  const codigo = page.getByRole("status").getByRole("code");
  const valor = await codigo.innerText();
  await page.getByRole("button", { name: "Copiar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeVisible();
  const campo = page.getByLabel("Documento", { exact: true });
  await campo.fill("12345678900");
  await campo.press("Enter");
  await expect(page.getByRole("alert")).toHaveText("CPF inválido.");
  await campo.clear();
  await expect(codigo).toHaveText(valor);
  await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(valor);
});
