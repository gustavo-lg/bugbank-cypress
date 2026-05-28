import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('que o usuário está logado e na home', () => {
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
  cy.get('#textBalance').should('be.visible')
})

When('clico no botão de Saque', () => {
  cy.get('#btn-SAQUE').click()
})

Then('vejo o modal com texto {string}', (texto: string) => {
  cy.get('#modalText')
    .should('be.visible')
    .and('have.text', texto)
})

Then('o botão {string} está visível no modal', (_label: string) => {
  cy.get('#btnCloseModal').should('be.visible')
})
