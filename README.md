# Validador e Gerador de CPF e CNPJ

Aplicação web desenvolvida em React com Vite para validação e geração de documentos brasileiros, contemplando CPF, CNPJ numérico e CNPJ alfanumérico.

O projeto permite validar documentos informados pelo usuário e gerar documentos válidos com ou sem máscara.

## Finalidade

Este projeto foi desenvolvido com dois objetivos principais:

* Apoiar validações de CPF, CNPJ numérico e CNPJ alfanumérico.
* Servir como ambiente de estudo para aplicação de testes automatizados e pipeline de validação.

## Tecnologias utilizadas

* React
* Vite
* JavaScript
* CSS
* Vitest
* Playwright
* GitHub Actions

## Testes automatizados

O projeto foi utilizado para estudo e implementação de diferentes camadas de teste:

* Testes de unidade com Vitest.
* Testes E2E com Playwright.
* Execução local dos testes.
* Configuração de pipelines com GitHub Actions.
* Validação automática em Pull Requests.
* Bloqueio de merge com status checks obrigatórios.

## Scripts principais

```bash
npm run dev
```

Executa o projeto localmente.

```bash
npm run test:unit
```

Executa os testes de unidade.

```bash
npm run test:unit:watch
```

Executa os testes de unidade em modo observação.

```bash
npm run test:e2e
```

Executa os testes E2E com Playwright.

```bash
npm run test:e2e:headed
```

Executa os testes E2E com o navegador visível.

```bash
npm run test:e2e:ui
```

Abre a interface visual do Playwright.

## Pipeline

O projeto possui pipelines configuradas com GitHub Actions para execução automática dos testes em Pull Requests direcionados para a branch principal.

O objetivo da pipeline é validar as alterações antes do merge, garantindo que mudanças com testes quebrados não sejam integradas à `main`.

## Observação

Este projeto tem finalidade educacional e de apoio ao desenvolvimento/testes. Os documentos gerados seguem regras de formação e dígito verificador, mas não representam necessariamente documentos reais de pessoas ou empresas.


Versão online: https://cnpj-cpf.vercel.app/


