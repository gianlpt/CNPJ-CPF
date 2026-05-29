// CNPJ numérico (formato antigo)

export function validarCnpjNumerico(valor) {
  if (!valor) return false;

  const cnpj = normalizarCnpjNumerico(valor);

  if (!/^\d{14}$/.test(cnpj)) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const d1 = calcularDigito(
    cnpj.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const d2 = calcularDigito(
    cnpj.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return cnpj[12] === String(d1) && cnpj[13] === String(d2);
}

export function gerarCnpjNumerico(formatado = true) {
  const base = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
  base.push(0, 0, 0, 1); // filial 0001

  const d1 = calcularDigito(
    base.join(""),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const d2 = calcularDigito(
    base.join("") + d1,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  const cnpj = base.join("") + d1 + d2;

  if (!formatado) return cnpj;

  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
    5,
    8
  )}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

export function normalizarCnpjNumerico(valor) {
  return String(valor).replace(/\D/g, "");
}

function calcularDigito(base, pesos) {
  const soma = base
    .split("")
    .reduce((total, c, i) => total + Number(c) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}
