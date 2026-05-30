export function validarCnpjAlfanumerico(valor) {
  if (!valor) return false;

  const cnpj = normalizarCnpjAlfanumerico(valor);

  // Formato esperado:
  // 12 primeiros caracteres alfanuméricos + 2 dígitos verificadores numéricos.
  //if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) {
    return false;
  }

  // Evita sequências repetidas, como:
  // 00000000000000, AAAAAAAAAAAAAA, 11111111111111.
  if (/^([A-Z0-9])\1{13}$/.test(cnpj)) {
    return false;
  }

  const base = cnpj.slice(0, 12);
  const digitosInformados = cnpj.slice(12, 14);

  const primeiroDigito = calcularDigitoVerificador(base);
  const segundoDigito = calcularDigitoVerificador(base + primeiroDigito);

  const digitosCalculados = `${primeiroDigito}${segundoDigito}`;

  return digitosInformados === digitosCalculados;
}

export function gerarCnpjAlfanumerico(formatado = true) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const base = Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");

  const d1 = calcularDigitoVerificador(base);
  const d2 = calcularDigitoVerificador(base + d1);

  const cnpj = base + d1 + d2;

  if (!formatado) return cnpj;

  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
    5,
    8
  )}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

export function normalizarCnpjAlfanumerico(valor) {
  return String(valor)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function calcularDigitoVerificador(base) {
  const pesos =
    base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const soma = base.split("").reduce((total, caractere, index) => {
    return total + converterCaractereParaValor(caractere) * pesos[index];
  }, 0);

  const resto = soma % 11;

  return resto < 2 ? 0 : 11 - resto;
}

function converterCaractereParaValor(caractere) {
  // Regra usada no CNPJ alfanumérico:
  // valor para cálculo = código ASCII do caractere - 48
  //
  // Exemplos:
  // "0" => 48 - 48 = 0
  // "1" => 49 - 48 = 1
  // "A" => 65 - 48 = 17
  // "B" => 66 - 48 = 18
  return caractere.charCodeAt(0) - 48;
}
