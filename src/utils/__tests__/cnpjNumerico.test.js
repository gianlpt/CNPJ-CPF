import { describe, it, expect } from "vitest"; 
import { validarCnpjNumerico } from "../cnpjNumerico";

describe("Testes função validarCnpjNumerico", () => {
  it("deve retornar true para CNPJ numérico válido", () => {
    expect(validarCnpjNumerico("12345678000195")).toBe(true);
    expect(validarCnpjNumerico("11222333000181")).toBe(true);
  });

    it("deve retornar false para CNPJ numérico inválido", () => {
    expect(validarCnpjNumerico("12345678000196")).toBe(false);
    expect(validarCnpjNumerico("11222333000182")).toBe(false);
    expect(validarCnpjNumerico("112223330001812")).toBe(false);
    expect(validarCnpjNumerico("112223330001")).toBe(false);
    expect(validarCnpjNumerico("%$#ˆ$#%#$R")).toBe(false);
  });

});