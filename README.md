# BugBank — Automação de Testes com Cypress + TypeScript

![BugBank](https://img.shields.io/badge/BugBank-Automação%20E2E-purple?style=for-the-badge)
![Cypress](https://img.shields.io/badge/Cypress-13.x-04C38E?style=for-the-badge&logo=cypress)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![BDD](https://img.shields.io/badge/BDD-Gherkin-23D96C?style=for-the-badge)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions)

---

## Sobre o Projeto

Projeto de automação de testes _end-to-end_ para a aplicação bancária
[BugBank](https://bugbank.netlify.app/) — um banco fictício criado para fins
de estudo e prática de QA.

Os testes cobrem os fluxos principais da aplicação: **Login**, **Cadastro**,
**Transferência**, **Extrato**, **Pagamento** e **Saque**, escritos em linguagem
natural com **Gherkin** (PT-BR) seguindo o padrão **BDD** e implementados com
**Page Objects** tipados em TypeScript.

---

## Stack

| Tecnologia                              | Versão  | Finalidade                          |
|-----------------------------------------|---------|-------------------------------------|
| [Cypress](https://www.cypress.io/)      | ^13.x   | Framework de automação E2E          |
| TypeScript                              | ^5.x    | Tipagem estática                    |
| `@badeball/cypress-cucumber-preprocessor` | ^21.x | Suporte a BDD / Gherkin             |
| `@bahmutov/cypress-esbuild-preprocessor` | ^2.x  | Transpilação rápida com esbuild     |
| esbuild                                 | ^0.24.x | Bundler de alta performance         |

---

## Estrutura do Projeto

```
bugbank-cypress/
├── .github/
│   └── workflows/
│       └── cypress.yml             # Pipeline CI/CD — GitHub Actions
├── cypress/
│   ├── e2e/
│   │   ├── login/
│   │   │   ├── login.feature       # Cenários BDD em Gherkin
│   │   │   └── login.cy.ts         # Step definitions
│   │   ├── cadastro/
│   │   │   ├── cadastro.feature
│   │   │   └── cadastro.cy.ts
│   │   ├── transferencia/
│   │   │   ├── transferencia.feature
│   │   │   └── transferencia.cy.ts
│   │   ├── extrato/
│   │   │   ├── extrato.feature
│   │   │   └── extrato.cy.ts
│   │   ├── pagamento/
│   │   │   ├── pagamento.feature
│   │   │   └── pagamento.cy.ts
│   │   └── saque/
│   │       ├── saque.feature
│   │       └── saque.cy.ts
│   ├── fixtures/
│   │   ├── usuarios.json           # Dados de usuários para testes
│   │   └── transferencia.json      # Dados de transferências para testes
│   ├── pages/
│   │   ├── LoginPage.ts            # Page Object — Login
│   │   ├── CadastroPage.ts         # Page Object — Cadastro
│   │   ├── TransferenciaPage.ts    # Page Object — Transferência
│   │   └── ExtratoPage.ts          # Page Object — Extrato
│   └── support/
│       ├── commands.ts             # Comandos customizados do Cypress
│       └── e2e.ts                  # Arquivo de entrada do suporte E2E
├── cypress.config.ts               # Configuração do Cypress
├── tsconfig.json                   # Configuração do TypeScript
├── package.json
└── README.md
```

---

## Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x

Verifique as versões instaladas:

```bash
node -v
npm -v
```

---

## Como Instalar

```bash
# Clone o repositório (se ainda não o fez)
git clone <url-do-repositorio>
cd bugbank-cypress

# Instale as dependências
npm install
```

---

## Como Executar

### Modo Headless (CI/CD)

```bash
npx cypress run
```

### Modo Interativo (interface gráfica)

```bash
npx cypress open
```

### Executar por módulo

```bash
# Somente Login
npm run test:login

# Somente Cadastro
npm run test:cadastro

# Somente Transferência
npm run test:transferencia

# Somente Extrato
npm run test:extrato
```

### CI/CD — GitHub Actions

O pipeline está configurado em `.github/workflows/cypress.yml` e é disparado automaticamente em todo `push` ou `pull_request` para `main`/`master`, e também pode ser acionado manualmente via **workflow_dispatch**.

Cada módulo roda em um step separado com `continue-on-error: true`, garantindo que todos os resultados sejam coletados mesmo quando um módulo falha. Screenshots de falhas são publicados como artefato (`cypress-screenshots`) com retenção de 7 dias.

> **Bugs conhecidos:** CT-014 e CT-021 (Transferência) causam falha orgânica esperada — documentados no Plano de Testes.

---

## Cenários Cobertos

| ID       | Cenário                                              | Módulo         |
|----------|------------------------------------------------------|----------------|
| CT-001   | Login com credenciais válidas                        | Login          |
| CT-002   | Login sem preencher e-mail e senha                   | Login          |
| CT-003   | Login sem preencher apenas o e-mail                  | Login          |
| CT-004   | Login sem preencher apenas a senha                   | Login          |
| CT-005   | Login com usuário não cadastrado                     | Login          |
| CT-006   | Login com senha incorreta                            | Login          |
| CT-007   | Cadastro com saldo inicial ativo                     | Cadastro       |
| CT-008   | Cadastro sem saldo inicial                           | Cadastro       |
| CT-009   | Cadastro sem preencher Nome                          | Cadastro       |
| CT-010   | Cadastro sem preencher E-mail                        | Cadastro       |
| CT-011   | Cadastro sem preencher Senha                         | Cadastro       |
| CT-012   | Cadastro sem preencher Confirmação de Senha          | Cadastro       |
| CT-013   | Cadastro com senhas divergentes                      | Cadastro       |
| CT-014   | Transferência com sucesso (bug: #btnBack crasha a home)          | Transferência  |
| CT-015   | Transferência para conta inválida                                | Transferência  |
| CT-016   | Transferência com saldo insuficiente                             | Transferência  |
| CT-017   | Transferência com valor maior que o saldo                        | Transferência  |
| CT-018   | Transferência com valor zero                                     | Transferência  |
| CT-019   | Transferência sem preencher Valor (erro inline)                  | Transferência  |
| CT-020   | Descrição em branco é permitida (campo opcional)                 | Transferência  |
| CT-021   | Campos de conta aceitam apenas números (bug: aceita texto)       | Transferência  |
| CT-022   | Extrato exibe saldo atualizado (conta com saldo)                 | Extrato        |
| CT-023   | Extrato exibe saldo zerado (conta sem saldo inicial)             | Extrato        |
| CT-024   | Data da transação corresponde à data de hoje                     | Extrato        |
| CT-025   | Pagamento exibe modal "Em desenvolvimento"                       | Pagamento      |
| CT-026   | Saque exibe modal "Em desenvolvimento"                           | Saque          |

---

## Padrões Utilizados

### Page Object Model (POM)

Cada tela da aplicação possui um Page Object dedicado em `cypress/pages/`.
Os métodos encapsulam interações com o DOM, são tipados e encadeáveis (`return this`),
nomeados em **camelCase descritivo PT-BR** (ex: `preencherEmail()`, `clicarAcessar()`).

```typescript
// Exemplo de uso encadeado
loginPage
  .preencherEmail('usuario@teste.com')
  .preencherSenha('Senha@123')
  .clicarAcessar()
```

### BDD com Gherkin

Os cenários são escritos em **PT-BR** usando a sintaxe Gherkin:
`Funcionalidade`, `Contexto`, `Cenário`, `Dado`, `Quando`, `Então`, `E`.

Cada arquivo `.feature` possui um arquivo `.cy.ts` correspondente com as
implementações dos steps usando `@badeball/cypress-cucumber-preprocessor`.

### Fixtures

Dados de teste centralizados em `cypress/fixtures/`:
- `usuarios.json` — credenciais de usuários (válido, inválido, novo)
- `transferencia.json` — dados de transferências (válida, inválida, semSaldo, valorZero)

### Comandos Customizados

| Comando                                        | Descrição                                              |
|------------------------------------------------|--------------------------------------------------------|
| `cy.loginValido()`                             | Login completo via UI com usuário válido               |
| `cy.cadastrarUsuario(nome, email, senha, saldo)` | Preenche e submete o formulário de cadastro          |
| `cy.loginViaLocalStorage(email, senha)`        | Injeta sessão no localStorage (setup rápido)           |
| `cy.setupExtratoComTransacoes()`               | Cria dois usuários no localStorage com transações reais (Abertura de conta + Transferencia enviada/recebida) para cenários de extrato |

---

## Configuração de TypeScript

O projeto usa **TypeScript strict** com `strict: true`, sem `any` implícito.
Os tipos dos comandos customizados são declarados via `declare global` no
arquivo `commands.ts` para disponibilidade em todo o projeto.

---

## Licença

MIT — livre para uso educacional e profissional.