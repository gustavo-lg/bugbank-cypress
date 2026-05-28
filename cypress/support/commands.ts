/// <reference types="cypress" />

interface UsuarioValido {
  email: string
  senha: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Realiza login completo via UI com o usuário válido das fixtures.
       * @example cy.loginValido()
       */
      loginValido(): Chainable<void>

      /**
       * Preenche e submete o formulário de cadastro.
       * @param nome - Nome completo do usuário
       * @param email - E-mail do usuário
       * @param senha - Senha do usuário
       * @param comSaldo - Se deve ativar o toggle de saldo inicial
       * @example cy.cadastrarUsuario('João', 'joao@teste.com', 'Senha@123', true)
       */
      cadastrarUsuario(
        nome: string,
        email: string,
        senha: string,
        comSaldo: boolean
      ): Chainable<void>

      /**
       * Injeta credenciais no localStorage usando o schema real do BugBank.
       * Cria o registro do usuário sob a chave igual ao e-mail, define as
       * transações em "transaction:{email}" e marca a sessão em "logged".
       * @param email - E-mail do usuário
       * @param senha - Senha do usuário
       * @example cy.loginViaLocalStorage('usuario@teste.com', 'Senha@123')
       */
      loginViaLocalStorage(email: string, senha: string): Chainable<void>

      /**
       * Cria dois usuários no localStorage com o schema real do BugBank e
       * injeta transações verificáveis (Abertura de conta + Transferencia
       * enviada). Loga como remetente para que o extrato tenha dados reais.
       * @example cy.setupExtratoComTransacoes()
       */
      setupExtratoComTransacoes(): Chainable<void>
    }
  }
}

// ─── Implementação dos comandos customizados ──────────────────────────────────

Cypress.Commands.add('loginValido', () => {
  cy.fixture<{ valido: UsuarioValido }>('usuarios').then(({ valido }) => {
    cy.visit('/')
    cy.get('.card__login form input[name="email"]').clear().type(valido.email)
    cy.get('.card__login form input[name="password"]').clear().type(valido.senha)
    cy.get('.card__login form button[type="submit"]').click()
    cy.get('#textBalance').should('be.visible')
  })
})

Cypress.Commands.add(
  'cadastrarUsuario',
  (nome: string, email: string, senha: string, comSaldo: boolean) => {
    cy.visit('/')
    cy.get('.login__buttons button[type="button"]').click()
    // O BugBank usa backface-visibility:hidden no card flip — { force: true } é necessário
    cy.get('.card__register form input[name="name"]').clear({ force: true }).type(nome, { force: true })
    cy.get('.card__register form input[name="email"]').clear({ force: true }).type(email, { force: true })
    cy.get('.card__register form input[name="password"]').clear({ force: true }).type(senha, { force: true })
    cy.get('.card__register form input[name="passwordConfirmation"]').clear({ force: true }).type(senha, { force: true })

    if (comSaldo) {
      cy.get('.card__register #toggleAddBalance').click({ force: true })
    }

    cy.get('.card__register form button[type="submit"]').click({ force: true })
  }
)

/**
 * cy.loginViaLocalStorage() — Injeta sessão usando o schema real do BugBank.
 *
 * Schema real (inspecionado via DevTools):
 *   chave = email do usuário → objeto com name, email, password, accountNumber, balance, logged
 *   chave = "transaction:{email}" → array de transações
 *   chave = "logged" → string com o email do usuário logado
 */
Cypress.Commands.add('loginViaLocalStorage', (email: string, senha: string) => {
  cy.window().then((win) => {
    const ls = win.localStorage
    const accountNumber = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1 + Math.random() * 9)}`

    ls.setItem(
      email,
      JSON.stringify({
        name: 'Usuario Teste',
        email,
        password: senha,
        accountNumber,
        balance: 1000,
        logged: true,
      })
    )

    ls.setItem(
      `transaction:${email}`,
      JSON.stringify([
        {
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString('pt-BR'),
          type: 'Abertura de conta',
          transferValue: 1000,
          description: 'Saldo adicionado ao abrir conta',
        },
      ])
    )

    ls.setItem('logged', email)
  })

  cy.visit('/home')
})

/**
 * cy.setupExtratoComTransacoes() — Cria dois usuários no localStorage e
 * injeta transações reais para que os cenários de extrato tenham dados
 * verificáveis (Abertura de conta + Transferencia enviada/recebida).
 *
 * A transação "Transferencia enviada" tem description vazia para que o
 * frontend renderize "-" no campo de descrição (necessário para CT-025).
 *
 * Deve ser chamado após cy.visit('/') para garantir que cy.window()
 * opere no domínio correto.
 */
Cypress.Commands.add('setupExtratoComTransacoes', () => {
  const uid = Date.now()
  const hoje = new Date().toLocaleDateString('pt-BR')

  const emailRemetente = `remetente_${uid}@bugbank.com`
  const emailDestinatario = `dest_${uid}@bugbank.com`
  const accountRemetente = `${1000 + (uid % 9000)}-${1 + (uid % 9)}`
  const accountDest = `${2000 + (uid % 7000)}-${2 + (uid % 7)}`

  cy.window().then((win) => {
    const ls = win.localStorage

    // Usuário remetente
    ls.setItem(
      emailRemetente,
      JSON.stringify({
        name: 'Remetente Teste',
        email: emailRemetente,
        password: emailRemetente,
        accountNumber: accountRemetente,
        balance: 800,
        logged: true,
      })
    )

    // Transações do remetente
    // description vazia na transferencia enviada → frontend renderiza "-" (CT-025)
    ls.setItem(
      `transaction:${emailRemetente}`,
      JSON.stringify([
        {
          id: `${uid}-1`,
          date: hoje,
          type: 'Abertura de conta',
          transferValue: 1000,
          description: 'Saldo adicionado ao abrir conta',
        },
        {
          id: `${uid}-2`,
          date: hoje,
          type: 'Transferencia enviada',
          transferValue: 200,
          description: '',
        },
      ])
    )

    // Usuário destinatário
    ls.setItem(
      emailDestinatario,
      JSON.stringify({
        name: 'Destinatario Teste',
        email: emailDestinatario,
        password: emailDestinatario,
        accountNumber: accountDest,
        balance: 1200,
        logged: false,
      })
    )

    // Transações do destinatário
    ls.setItem(
      `transaction:${emailDestinatario}`,
      JSON.stringify([
        {
          id: `${uid}-3`,
          date: hoje,
          type: 'Abertura de conta',
          transferValue: 1000,
          description: 'Saldo adicionado ao abrir conta',
        },
        {
          id: `${uid}-4`,
          date: hoje,
          type: 'Transferencia recebida',
          transferValue: 200,
          description: 'Pagamento de servico',
        },
      ])
    )

    // Sessão ativa = remetente
    ls.setItem('logged', emailRemetente)
  })

  cy.reload()
})

export { }
