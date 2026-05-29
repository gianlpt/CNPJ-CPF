import { useState } from "react";
import { validarCnpjAlfanumerico } from "./utils/cnpjAlfanumerico";

export default function App() {
  const [cnpj, setCnpj] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleChange(event) {
    setCnpj(event.target.value);
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
    if (!cnpj.trim()) {
      setErro("Informe um CNPJ.");
      setSucesso("");
      return;
    }

    const cnpjValido = validarCnpjAlfanumerico(cnpj);

    if (!cnpjValido) {
      setErro("Informe um CNPJ válido.");
      setSucesso("");
      return;
    }

    setErro("");
    setSucesso("CNPJ válido.");
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Validador de CNPJ alfanumérico</h1>

        <p className="description">
          Digite um CNPJ alfanumérico com ou sem máscara para validar os dois
          dígitos verificadores.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="cnpj">CNPJ</label>

            <input
              id="cnpj"
              name="cnpj"
              type="text"
              value={cnpj}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="12.ABC.345/01DE-35"
              aria-invalid={!!erro}
              aria-describedby={erro ? "cnpj-erro" : sucesso ? "cnpj-sucesso" : undefined}
            />

            {erro && (
              <p id="cnpj-erro" className="message error">
                {erro}
              </p>
            )}

            {sucesso && (
              <p id="cnpj-sucesso" className="message success">
                {sucesso}
              </p>
            )}
          </div>

          <button type="submit">Validar CNPJ</button>
        </form>

        <div className="examples">
          <h2>Exemplos para teste</h2>

          <ul>
            <li>
              <code>12.ABC.345/01DE-35</code> — válido
            </li>
            <li>
              <code>12ABC34501DE35</code> — válido sem máscara
            </li>
            <li>
              <code>12.ABC.345/01DE-00</code> — inválido
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
