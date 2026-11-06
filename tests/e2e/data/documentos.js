// Valores fixos verificam os resultados sem usar os validadores da aplicação.
export const documentos = [
  {
    tipo: "CPF",
    botao: /^CPF Gera/,
    comMascara: "123.456.789-09",
    semMascara: "12345678909",
    outroValido: "02118578075",
    padraoComMascara: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    padraoSemMascara: /^\d{11}$/,
  },
  {
    tipo: "CNPJ numérico",
    botao: /^CNPJ numérico Gera/,
    comMascara: "12.345.678/0001-95",
    semMascara: "12345678000195",
    outroValido: "11222333000181",
    padraoComMascara: /^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/,
    padraoSemMascara: /^\d{8}0001\d{2}$/,
  },
  {
    tipo: "CNPJ alfanumérico",
    botao: /^CNPJ alfanumérico Gera/,
    comMascara: "12.ABC.345/01DE-35",
    semMascara: "12ABC34501DE35",
    outroValido: "5J1GTS7V9T3U00",
    padraoComMascara: /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-\d{2}$/,
    padraoSemMascara: /^[A-Z0-9]{12}\d{2}$/,
  },
];

export const formatos = [
  { nome: "com máscara", campo: "comMascara", padrao: "padraoComMascara" },
  { nome: "sem máscara", campo: "semMascara", padrao: "padraoSemMascara" },
];

export const mensagemFormato =
  "Formato não identificado. Informe um CPF com 11 números ou um CNPJ com 14 caracteres.";
