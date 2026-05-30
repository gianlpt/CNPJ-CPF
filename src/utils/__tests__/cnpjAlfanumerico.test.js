import { expect, it, describe } from "vitest";
import { validarCnpjAlfanumerico } from "../cnpjAlfanumerico";

describe("validarCnpjAlfanumerico", () => {
    it("deve retornar true para CNPJ alfanumérico válido", () => {
        expect(validarCnpjAlfanumerico("83.S28.WN0/8BOW-71")).toBe(true);
        expect(validarCnpjAlfanumerico("5J1GTS7V9T3U00")).toBe(true);
    });
    
    it("deve retornar false para CNPJ alfanumérico inválido", () => {
        expect(validarCnpjAlfanumerico("83S28WN08BOW72")).toBe(false);
        expect(validarCnpjAlfanumerico("5J.1GT.S7V/9T3U-11")).toBe(false);
        expect(validarCnpjAlfanumerico("34543653")).toBe(false);
        expect(validarCnpjAlfanumerico(" ")).toBe(false);
        expect(validarCnpjAlfanumerico("5J1GTS7V9T3U@@")).toBe(false);
    });
});
