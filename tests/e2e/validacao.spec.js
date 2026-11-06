import { expect, test } from "@playwright/test";
import { documentos, formatos, mensagemFormato } from "./data/documentos.js";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Documentos válidos", () => {
  for (const documento of documentos) {
    for (const formato of formatos) {
      test(`valida ${documento.tipo} ${formato.nome}`, async ({ page }) => {
        const campo = page.getByLabel("Documento", { exact: true });
        await campo.fill(documento[formato.campo]);
        await page.getByRole("button", { name: "Validar documento", exact: true }).click();
        await expect(page.getByRole("status")).toHaveText(`Documento válido — ${documento.tipo}.`);
        await expect(page.getByRole("alert")).toHaveCount(0);
        await expect(campo).toHaveAttribute("aria-invalid", "false");
        await expect(campo).toHaveAccessibleDescription(
          `Você pode digitar com ou sem pontuação. Documento válido — ${documento.tipo}.`,
        );
        await expect(campo).toHaveValue(documento[formato.campo]);
      });
    }

    test(`valida outro ${documento.tipo}, incluindo dígitos zero`, async ({ page }) => {
      await page.getByLabel("Documento", { exact: true }).fill(documento.outroValido);
      await page.getByRole("button", { name: "Validar documento", exact: true }).click();
      await expect(page.getByRole("status")).toHaveText(`Documento válido — ${documento.tipo}.`);
    });

    test(`valida ${documento.tipo} com espaços ao redor e entre caracteres`, async ({ page }) => {
      const valor = `  ${documento.comMascara.split("").join(" ")}  `;
      await page.getByLabel("Documento", { exact: true }).fill(valor);
      await page.getByRole("button", { name: "Validar documento", exact: true }).click();
      await expect(page.getByRole("status")).toHaveText(`Documento válido — ${documento.tipo}.`);
    });
  }

  test("converte letras minúsculas em maiúsculas e valida o CNPJ", async ({ page }) => {
    const campo = page.getByLabel("Documento", { exact: true });
    await campo.fill("12.abc.345/01de-35");
    await expect(campo).toHaveValue("12.ABC.345/01DE-35");
    await campo.press("Enter");
    await expect(page.getByRole("status")).toHaveText("Documento válido — CNPJ alfanumérico.");
  });
});

test.describe("Documentos inválidos", () => {
  const casos = [
    { nome: "CPF com primeiro dígito incorreto", valor: "12345678919", mensagem: "CPF inválido." },
    { nome: "CPF com segundo dígito incorreto", valor: "123.456.789-00", mensagem: "CPF inválido." },
    { nome: "CNPJ numérico com primeiro dígito incorreto", valor: "12345678000185", mensagem: "CNPJ numérico inválido." },
    { nome: "CNPJ numérico com segundo dígito incorreto", valor: "12.345.678/0001-96", mensagem: "CNPJ numérico inválido." },
    { nome: "CNPJ alfanumérico com primeiro dígito incorreto", valor: "12ABC34501DE45", mensagem: "CNPJ alfanumérico inválido." },
    { nome: "CNPJ alfanumérico com segundo dígito incorreto", valor: "12.ABC.345/01DE-36", mensagem: "CNPJ alfanumérico inválido." },
    { nome: "CNPJ com letra no primeiro dígito verificador", valor: "12ABC34501DEA5", mensagem: "CNPJ alfanumérico inválido." },
    { nome: "CNPJ com letra no segundo dígito verificador", valor: "12ABC34501DE3A", mensagem: "CNPJ alfanumérico inválido." },
    { nome: "CPF com 10 caracteres", valor: "1234567890", mensagem: mensagemFormato },
    { nome: "CPF com 12 caracteres", valor: "123456789090", mensagem: mensagemFormato },
    { nome: "CNPJ com 13 caracteres", valor: "1234567800019", mensagem: mensagemFormato },
    { nome: "CNPJ com 15 caracteres", valor: "12ABC34501DE350", mensagem: mensagemFormato },
    { nome: "CPF contendo letras", valor: "123456789AB", mensagem: mensagemFormato },
    { nome: "texto livre", valor: "documento", mensagem: mensagemFormato },
    { nome: "somente pontuação", valor: ".../---", mensagem: "Informe um CPF ou CNPJ." },
    { nome: "somente símbolos", valor: "@#$%&*", mensagem: "Informe um CPF ou CNPJ." },
  ];

  for (const digito of ["0", "1", "9"]) {
    casos.push(
      { nome: `CPF repetindo o dígito ${digito}`, valor: digito.repeat(11), mensagem: "CPF inválido." },
      { nome: `CNPJ repetindo o dígito ${digito}`, valor: digito.repeat(14), mensagem: "CNPJ numérico inválido." },
    );
  }
  casos.push({ nome: "CNPJ repetindo letras", valor: "A".repeat(14), mensagem: "CNPJ alfanumérico inválido." });

  for (const caso of casos) {
    test(`rejeita ${caso.nome}`, async ({ page }) => {
      const campo = page.getByLabel("Documento", { exact: true });
      await campo.fill(caso.valor);
      await page.getByRole("button", { name: "Validar documento", exact: true }).click();
      await expect(page.getByRole("alert")).toHaveText(caso.mensagem);
      await expect(page.getByRole("status")).toHaveCount(0);
      await expect(campo).toHaveAttribute("aria-invalid", "true");
      await expect(campo).toHaveAccessibleDescription(
        `Você pode digitar com ou sem pontuação. ${caso.mensagem}`,
      );
    });
  }
});

test.describe("Estado do formulário", () => {
  for (const [nome, valor] of [["vazio", ""], ["com espaços", "   "], ["com tabulação", "\t "]]) {
    test(`desabilita a validação quando o campo está ${nome}`, async ({ page }) => {
      const campo = page.getByLabel("Documento", { exact: true });
      const validar = page.getByRole("button", { name: "Validar documento", exact: true });
      await campo.fill("12345678909");
      await expect(validar).toBeEnabled();
      await campo.fill(valor);
      await expect(validar).toBeDisabled();
      await campo.press("Enter");
      await expect(page.getByRole("alert")).toHaveCount(0);
      await expect(page.getByRole("status")).toHaveCount(0);
    });
  }

  for (const [nome, valor, role] of [
    ["sucesso", "12345678909", "status"],
    ["erro", "12345678900", "alert"],
  ]) {
    test(`remove o feedback de ${nome} quando o documento é editado`, async ({ page }) => {
      const campo = page.getByLabel("Documento", { exact: true });
      await campo.fill(valor);
      await campo.press("Enter");
      await expect(page.getByRole(role)).toBeVisible();
      await campo.fill("12ABC34501DE35");
      await expect(page.getByRole("alert")).toHaveCount(0);
      await expect(page.getByRole("status")).toHaveCount(0);
      await expect(campo).toHaveAttribute("aria-invalid", "false");
      await campo.press("Enter");
      await expect(page.getByRole("status")).toHaveText("Documento válido — CNPJ alfanumérico.");
    });
  }

  test("limpa o erro e desabilita a validação ao apagar o documento", async ({ page }) => {
    const campo = page.getByLabel("Documento", { exact: true });
    await campo.fill("12345678900");
    await campo.press("Enter");
    await expect(page.getByRole("alert")).toBeVisible();
    await campo.clear();
    await expect(campo).toHaveAttribute("aria-invalid", "false");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Validar documento", exact: true })).toBeDisabled();
  });
});
