# Validador de CNPJ Alfanumérico

Projeto React com Vite para testar um campo de CNPJ alfanumérico.

## Como rodar localmente

Depois de baixar e extrair o `.zip`, entre na pasta do projeto:

```bash
cd cnpj-alfanumerico-react
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

Depois acesse no navegador o endereço exibido no terminal, geralmente:

```bash
http://localhost:5173
```

## Como testar só o validador no terminal

```bash
npm run test:cnpj
```

## Estrutura principal

```text
src/
  App.jsx
  main.jsx
  style.css
  utils/
    cnpjAlfanumerico.js
scripts/
  test-cnpj.js
```

## Exemplos

- `12.ABC.345/01DE-35` → válido
- `12ABC34501DE35` → válido
- `12.ABC.345/01DE-00` → inválido
