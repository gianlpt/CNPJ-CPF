import { describe, expect, it } from "vitest";
import { validarCpf } from "../cpf";

describe("Testes função validarCpf", () => {
  it("deve retornar true para CPF válido", () => {
    expect(validarCpf("123.456.789-09")).toBe(true);
    expect(validarCpf("11144477735")).toBe(true);
  });

  it("deve retornar false para CPF inválido", () => {
    expect(validarCpf("123.456.789-00")).toBe(false);
    expect(validarCpf("111.444.777-00")).toBe(false);
    expect(validarCpf("@@#%$%ˆ%")).toBe(false);
  });
});