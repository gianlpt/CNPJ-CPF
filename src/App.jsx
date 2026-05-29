import { useState, useEffect } from "react";
import { validarCpf, gerarCpf } from "./utils/cpf";
import { validarCnpjNumerico, gerarCnpjNumerico } from "./utils/cnpjNumerico";
import {
  validarCnpjAlfanumerico,
  gerarCnpjAlfanumerico,
} from "./utils/cnpjAlfanumerico";

const TIPOS = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj-antigo", label: "CNPJ — Formato antigo (numérico)" },
  { value: "cnpj-novo", label: "CNPJ — Novo formato (alfanumérico)" },
];

function getPlaceholder(tipo) {
  if (tipo === "cpf") return "123.456.789-09";
  if (tipo === "cnpj-antigo") return "12.345.678/0001-95";
  return "12.ABC.345/01DE-35";
}

function validarPorTipo(tipo, valor) {
  if (tipo === "cpf") return validarCpf(valor);
  if (tipo === "cnpj-antigo") return validarCnpjNumerico(valor);
  return validarCnpjAlfanumerico(valor);
}

function gerarPorTipo(tipo) {
  if (tipo === "cpf") return gerarCpf(true);
  if (tipo === "cnpj-antigo") return gerarCnpjNumerico(true);
  return gerarCnpjAlfanumerico(true);
}

export default function App() {
  const [tipo, setTipo] = useState("cpf");
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [gerado, setGerado] = useState("");
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEasterEgg(true);
      setTimeout(() => setEasterEgg(false), 2200);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  function handleTipoChange(e) {
    setTipo(e.target.value);
    setValor("");
    setErro("");
    setSucesso("");
    setGerado("");
  }

  function handleChange(event) {
    setValor(event.target.value);
    setErro("");
    setSucesso("");
  }

  function handleBlur() {
    validarCampo();
  }

  function handleSubmit(event) {
    event.preventDefault();
    validarCampo();
  }

  function validarCampo() {
    if (!valor.trim()) {
      setErro("Informe um valor.");
      setSucesso("");
      return;
    }

    if (!validarPorTipo(tipo, valor)) {
      setErro("Documento inválido.");
      setSucesso("");
      return;
    }

    setErro("");
    setSucesso("Documento válido ✓");
  }

  function handleGerar() {
    setGerado(gerarPorTipo(tipo));
    setValor("");
    setErro("");
    setSucesso("");
  }

  function handleCopiarGerado() {
    navigator.clipboard.writeText(gerado);
  }

  const tipoLabel = TIPOS.find((t) => t.value === tipo)?.label ?? "";

  return (
    <>
      <main className="page">
        <section className="card">
          <h1>Validador &amp; Gerador</h1>

          <p className="description">
            Selecione o tipo de documento, valide ou gere valores com máscara.
          </p>

          <div className="field" style={{ marginBottom: 20 }}>
            <label htmlFor="tipo">Tipo de documento</label>
            <select id="tipo" value={tipo} onChange={handleTipoChange}>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="valor">Validar {tipoLabel}</label>

              <input
                id="valor"
                name="valor"
                type="text"
                value={valor}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={getPlaceholder(tipo)}
                aria-invalid={!!erro}
                aria-describedby={
                  erro ? "valor-erro" : sucesso ? "valor-sucesso" : undefined
                }
              />

              {erro && (
                <p id="valor-erro" className="message error">
                  {erro}
                </p>
              )}

              {sucesso && (
                <p id="valor-sucesso" className="message success">
                  {sucesso}
                </p>
              )}
            </div>

            <button type="submit">Validar</button>
          </form>

          <div className="divider" />

          <div className="field" style={{ marginTop: 20 }}>
            <label>Gerar {tipoLabel}</label>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleGerar}
            >
              Gerar
            </button>

            {gerado && (
              <div className="generated">
                <code>{gerado}</code>
                <button
                  type="button"
                  className="btn-copy"
                  onClick={handleCopiarGerado}
                >
                  Copiar
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {easterEgg && (
        <img
          src="/fabricio-rei-de-tudo-e-todos.png"
          alt=""
          className="easter-egg"
        />
      )}
    </>
  );
}
