export function validarCpf(valor) {
  if (!valor) return false;

  const cpf = normalizarCpf(valor);

  if (!/^\d{11}$/.test(cpf)) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const primeiroDigito = calcularDigitoCpf(cpf.slice(0, 9), 10);
  const segundoDigito = calcularDigitoCpf(cpf.slice(0, 10), 11);

  return cpf[9] === String(primeiroDigito) && cpf[10] === String(segundoDigito);
}

export function gerarCpf(formatado = true) {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));

  const d1 = calcularDigitoCpf(base.join(""), 10);
  const d2 = calcularDigitoCpf(base.join("") + d1, 11);

  const cpf = base.join("") + d1 + d2;

  if (!formatado) return cpf;

  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(
    9
  )}`;
}

export function normalizarCpf(valor) {
  return String(valor).replace(/\D/g, "");
}

function calcularDigitoCpf(base, pesoInicial) {
  const soma = base
    .split("")
    .reduce(
      (total, digito, i) => total + Number(digito) * (pesoInicial - i),
      0
    );

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}
