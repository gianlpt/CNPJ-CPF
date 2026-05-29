import { useState } from "react";
import { validarCpf, gerarCpf } from "./utils/cpf";
import { validarCnpjNumerico, gerarCnpjNumerico } from "./utils/cnpjNumerico";
import {
  validarCnpjAlfanumerico,
  gerarCnpjAlfanumerico,
} from "./utils/cnpjAlfanumerico";

const GERADORES = [
  {
    id: "cpf",
    titulo: "CPF",
    descricao: "Gera um CPF válido.",
    acao: (usarMascara) => gerarCpf(usarMascara),
  },
  {
    id: "cnpj-numerico",
    titulo: "CNPJ numérico",
    descricao: "Gera um CNPJ válido no formato antigo.",
    acao: (usarMascara) => gerarCnpjNumerico(usarMascara),
  },
  {
    id: "cnpj-alfanumerico",
    titulo: "CNPJ alfanumérico",
    descricao: "Gera um CNPJ válido no novo formato.",
    acao: (usarMascara) => gerarCnpjAlfanumerico(usarMascara),
  },
];

function limparDocumento(valor) {
  return valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function identificarDocumento(valor) {
  const documento = limparDocumento(valor);

  if (!documento) {
    return {
      status: "erro",
      mensagem: "Informe um CPF ou CNPJ.",
    };
  }

  const modelosPossiveis = [];

  if (/^\d{11}$/.test(documento)) {
    modelosPossiveis.push({
      tipo: "CPF",
      valido: validarCpf(documento),
    });
  }

  if (/^\d{14}$/.test(documento)) {
    modelosPossiveis.push({
      tipo: "CNPJ numérico",
      valido: validarCnpjNumerico(documento),
    });
  }

  if (/^[A-Z0-9]{14}$/.test(documento) && /[A-Z]/.test(documento)) {
    modelosPossiveis.push({
      tipo: "CNPJ alfanumérico",
      valido: validarCnpjAlfanumerico(documento),
    });
  }

  if (modelosPossiveis.length === 0) {
    return {
      status: "erro",
      mensagem:
        "Formato não identificado. Informe um CPF com 11 números ou um CNPJ com 14 caracteres.",
    };
  }

  const documentoValido = modelosPossiveis.find((modelo) => modelo.valido);

  if (!documentoValido) {
    return {
      status: "erro",
      mensagem: `${modelosPossiveis[0].tipo} inválido.`,
    };
  }

  return {
    status: "sucesso",
    tipo: documentoValido.tipo,
    mensagem: `Documento válido — ${documentoValido.tipo}.`,
  };
}

export default function App() {
  const [valor, setValor] = useState("");
  const [resultado, setResultado] = useState(null);
  const [gerado, setGerado] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [usarMascara, setUsarMascara] = useState(true);

  function handleChange(event) {
    setValor(event.target.value.toUpperCase());
    setResultado(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setResultado(identificarDocumento(valor));
  }

  function handleGerar(gerador) {
    setGerado({
      tipo: gerador.titulo,
      valor: gerador.acao(usarMascara),
      mascara: usarMascara ? "com máscara" : "sem máscara",
    });

    setCopiado(false);
    setResultado(null);
  }

  async function handleCopiarGerado() {
    if (!gerado?.valor) return;

    await navigator.clipboard.writeText(gerado.valor);
    setCopiado(true);
  }

  const temErro = resultado?.status === "erro";
  const temSucesso = resultado?.status === "sucesso";

  return (
    <main className="page">
      <section className="card">
        <header className="header">
          <span className="eyebrow">Validador e gerador</span>
          <h1>CPF e CNPJ</h1>

          <p className="description">
            Valide CPF, CNPJ numérico ou CNPJ alfanumérico em um único campo.
            Para gerar documentos, escolha o tipo e o formato desejado.
          </p>
        </header>

        <form className="validator" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="documento">Documento</label>

            <input
              id="documento"
              name="documento"
              type="text"
              value={valor}
              onChange={handleChange}
              placeholder="Ex: 02118578075, 12.345.678/0001-95 ou 12.ABC.345/01DE-35"
              aria-invalid={temErro}
              aria-describedby="documento-ajuda documento-feedback"
              autoComplete="off"
            />

            <p id="documento-ajuda" className="hint">
              Você pode digitar com ou sem pontuação.
            </p>

            {resultado && (
              <p
                id="documento-feedback"
                className={`feedback ${
                  temSucesso ? "feedback-success" : "feedback-error"
                }`}
                role={temErro ? "alert" : "status"}
              >
                {resultado.mensagem}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={!valor.trim()}>
            Validar documento
          </button>
        </form>

        <div className="divider" />

        <section className="generators" aria-labelledby="generators-title">
          <div className="section-header">
            <h2 id="generators-title">Geradores</h2>
            <p>
              Escolha se deseja gerar o documento com máscara ou somente com os
              caracteres.
            </p>
          </div>

          <fieldset className="format-control">
            <legend>Formato do documento gerado</legend>

            <div className="format-options">
              <label className="format-option">
                <input
                  type="radio"
                  name="formato"
                  checked={usarMascara}
                  onChange={() => setUsarMascara(true)}
                />
                <span>Com máscara</span>
              </label>

              <label className="format-option">
                <input
                  type="radio"
                  name="formato"
                  checked={!usarMascara}
                  onChange={() => setUsarMascara(false)}
                />
                <span>Sem máscara</span>
              </label>
            </div>
          </fieldset>

          <div className="generator-grid">
            {GERADORES.map((gerador) => (
              <button
                key={gerador.id}
                type="button"
                className="generator-card"
                onClick={() => handleGerar(gerador)}
              >
                <strong>{gerador.titulo}</strong>
                <span>{gerador.descricao}</span>
              </button>
            ))}
          </div>

          {gerado && (
            <div className="generated" role="status">
              <div>
                <span className="generated-label">
                  {gerado.tipo} gerado {gerado.mascara}
                </span>
                <code>{gerado.valor}</code>
              </div>

              <button
                type="button"
                className="btn-copy"
                onClick={handleCopiarGerado}
              >
                {copiado ? "Copiado" : "Copiar"}
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}