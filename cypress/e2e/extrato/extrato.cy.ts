import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

// ─── Contexto ─────────────────────────────────────────────────────────────────

/**
 * Setup real via UI — evita cy.reload() que re-monta o React e perde estado.
 *
 * Fluxo:
 *  1. Cadastra destinatário (com saldo) → captura número de conta do modal
 *  2. Cadastra remetente (com saldo)
 *  3. Login como remetente via UI
 *  4. Transfere R$200 para destinatário com descrição "-"
 *     → gera "Abertura de conta" (crédito) e "Transferencia enviada" (débito)
 *     → descrição "-" satisfaz CT-025 (#textDescription deve ter texto "-")
 *  5. Fecha modal de sucesso e confirma redirecionamento para /bank-statement
 */
Given('que o usuário está logado e na tela de Extrato', () => {
  const uid = Date.now()
  const email = `user_${uid}@bugbank.com`
  const senha = 'Senha@123'

  // 1- Cadastrar um usuário
  cy.cadastrarUsuario('Usuario Teste', email, senha, true)
  cy.get('#btnCloseModal').click()

  // 2- Logar com o usuário
  cy.get('.card__login form input[name="email"]').clear().type(email)
  cy.get('.card__login form input[name="password"]').clear().type(senha)
  cy.get('.card__login form button[type="submit"]').click()
  
  // 3- Clicar no botão EXTRATO (no BugBank é o botão "Extrato" ou o link que leva para o extrato)
  cy.get('#btn-EXTRATO').click()
})

Given('que o usuário está logado sem saldo e na tela de Extrato', () => {
  const uid = Date.now()
  const email = `user_${uid}@bugbank.com`
  const senha = 'Senha@123'

  // 1- Cadastrar um usuário sem saldo (quarto parâmetro como false)
  cy.cadastrarUsuario('Usuario Teste', email, senha, false)
  cy.get('#btnCloseModal').click()

  // 2- Logar com o usuário
  cy.get('.card__login form input[name="email"]').clear().type(email)
  cy.get('.card__login form input[name="password"]').clear().type(senha)
  cy.get('.card__login form button[type="submit"]').click()
  
  // 3- Clicar no botão EXTRATO
  cy.get('#btn-EXTRATO').click()
})

// Steps de Verificação

Then('o saldo exibido corresponde ao saldo {string}', (saldoEsperado: string) => {
  cy.get('#textBalanceAvailable')
    .should('be.visible')
    .invoke('text')
    .then((texto) => {
      const textoNormalizado = texto.replace(/\u00a0/g, ' ').trim()
      const saldoNormalizado = saldoEsperado.replace(/\u00a0/g, ' ').trim()
      expect(textoNormalizado).to.include(saldoNormalizado)
    })
})

Then('a data da transação de abertura de conta corresponde à data de hoje', () => {
  const hoje = new Date().toLocaleDateString('pt-BR')
  cy.get('.bank-statement__Transaction-sc-7n8vh8-13')
    .contains('#textTypeTransaction', 'Abertura de conta')
    .closest('.bank-statement__Transaction-sc-7n8vh8-13')
    .find('#textDateTransaction')
    .should('have.text', hoje)
})
