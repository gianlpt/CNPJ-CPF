import { validarCnpjAlfanumerico } from "../src/utils/cnpjAlfanumerico.js";

const testes = [
  "12.ABC.345/01DE-35",
  "12ABC34501DE35",
  "12.ABC.345/01DE-00",
  "00000000000000",
  "",
];

testes.forEach((cnpj) => {
  console.log(`${cnpj || "(vazio)"}: ${validarCnpjAlfanumerico(cnpj)}`);
});
