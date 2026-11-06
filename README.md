# Validador e Gerador de CPF e CNPJ

Aplicação web desenvolvida em React com Vite para validação e geração de documentos brasileiros, contemplando CPF, CNPJ numérico e CNPJ alfanumérico.

O projeto permite validar documentos informados pelo usuário e gerar documentos válidos com ou sem máscara.

## Finalidade

Este projeto foi desenvolvido com dois objetivos principais:

* Apoiar validações de CPF, CNPJ numérico e CNPJ alfanumérico.
* Servir como ambiente de estudo para aplicação de testes automatizados com I.A e pipeline de validação.

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

## Cobertura E2E com Playwright

A suíte contém 65 cenários, executados em dois projetos: Chromium desktop e Chromium com emulação de Pixel 7. São 130 execuções cobrindo as funcionalidades disponíveis na interface.

| Área | Cenários cobertos |
| --- | --- |
| Tela inicial | Título, campo, ajuda, três geradores, formato padrão e ausência de resultados iniciais. |
| Validação | CPF, CNPJ numérico e CNPJ alfanumérico válidos, com e sem máscara; outros documentos válidos; zeros iniciais e nos verificadores; espaços e conversão para maiúsculas. |
| Rejeição de entradas | Dígitos verificadores incorretos, verificadores com letras, tamanhos incompatíveis, texto livre, sequências repetidas, pontuação e símbolos. |
| Estado do formulário | Botão desabilitado para campo vazio ou espaços; limpeza de feedback e de `aria-invalid` após edição; correção e nova validação. |
| Geração | Três tipos de documento nos dois formatos; conferência do formato e validação do resultado pela própria interface. |
| Cópia | Conteúdo real da área de transferência, confirmação “Copiado”, nova geração e nova cópia, inclusive pelo teclado. |
| Transições | Troca de gerador, mudança de formato, substituição do resultado, remoção do feedback ao gerar e preservação do campo digitado. |
| Navegação e layout | Tab, Enter e setas; mensagens acessíveis; ausência de rolagem horizontal; restauração do estado inicial ao recarregar. |

### Preparação e execução

Use Node.js 22.12+ ou 24+ e instale as dependências e o Chromium:

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```

O Playwright inicia o Vite automaticamente em `http://127.0.0.1:5173`. Não é necessário iniciar a aplicação antes dos testes. A porta é fixa; uma instância existente pode ser reutilizada localmente, mas o CI sempre inicia um servidor próprio.

Para executar apenas um projeto ou grupo de cenários:

```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=mobile-chromium
npm run test:e2e -- tests/e2e/validacao.spec.js
npm run test:e2e -- tests/e2e/geracao.spec.js
```

### Relatórios e manutenção

```bash
npx playwright show-report
```

O relatório HTML fica em `playwright-report/`. Em caso de falha, `test-results/` contém screenshot, vídeo e trace; para inspecionar um trace, execute `npx playwright show-trace caminho/trace.zip`. Essas pastas já estão no `.gitignore`.

Os testes usam rótulos e papéis acessíveis, sem seletores dependentes de classes CSS nem esperas fixas. Os documentos de referência ficam em `tests/e2e/data/documentos.js`. A geração usa uma sequência pseudoaleatória reproduzível nos testes de geração; as funções reais da aplicação são executadas no navegador. As cópias usam a API real de clipboard, com permissões concedidas somente ao contexto de teste. A execução usa um worker para evitar concorrência na área de transferência compartilhada do sistema.

A emulação móvel verifica a interface no Chromium; ela não substitui testes em aparelhos físicos ou em Safari/Firefox. A cobertura descrita é funcional e não representa uma medição de cobertura de linhas.

Referências: [boas práticas do Playwright](https://playwright.dev/docs/best-practices) e [servidor de testes](https://playwright.dev/docs/test-webserver).

## Codex no terminal

O Codex CLI está incluído nas dependências de desenvolvimento. Depois de instalar as dependências com `npm install`, execute na raiz do projeto:

```bash
npm run codex
```
## Pipeline

O projeto possui pipelines configuradas com GitHub Actions para execução automática dos testes em Pull Requests direcionados para a branch principal.

O objetivo da pipeline é validar as alterações antes do merge, garantindo que mudanças com testes quebrados não sejam integradas à `main`.

## Observação

Este projeto tem finalidade educacional e de apoio ao desenvolvimento/testes. Os documentos gerados seguem regras de formação e dígito verificador, mas não representam necessariamente documentos reais de pessoas ou empresas.


Versão online: https://cnpj-cpf.vercel.app/


