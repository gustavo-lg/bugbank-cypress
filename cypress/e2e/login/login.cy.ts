import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import loginPage from '../../pages/LoginPage'

// ─── Contexto ─────────────────────────────────────────────────────────────────

Given('que estou na página de Login do BugBank', () => {
  loginPage.acessarPagina()
})

// ─── Steps de Ação ────────────────────────────────────────────────────────────

When('preencho o e-mail {string} e a senha {string}', (email: string, senha: string) => {
  if (email === 'usuario@teste.com') {
    cy.cadastrarUsuario('Usuario Teste', email, 'Senha@123', true)
    cy.get('#btnCloseModal').click()
  }
  loginPage.preencherEmail(email).preencherSenha(senha)
})

When('clico em {string}', (botao: string) => {
  if (botao === 'Acessar') {
    loginPage.clicarAcessar()
  }
})

When('deixo os campos E-mail e Senha em branco', () => {
  loginPage.limparEmail().limparSenha()
})

When('deixo o campo E-mail em branco', () => {
  loginPage.limparEmail()
})

When('preencho a senha {string}', (senha: string) => {
  loginPage.preencherSenha(senha)
})

When('preencho o e-mail {string}', (email: string) => {
  loginPage.preencherEmail(email)
})

When('deixo o campo Senha em branco', () => {
  loginPage.limparSenha()
})

// ─── Steps de Verificação ─────────────────────────────────────────────────────

Then('sou redirecionado para a home', () => {
  cy.url().should('include', '/home')
})

Then('o saldo da conta é exibido', () => {
  cy.get('#textBalance').should('be.visible')
})

Then('o nome do usuário é exibido na home', () => {
  cy.window().then((win) => {
    const email = win.localStorage.getItem('logged')
    const userRaw = email ? win.localStorage.getItem(email) : null
    const nome = userRaw ? (JSON.parse(userRaw) as { name: string }).name : 'Usuario Teste'
    cy.get('#textName').should('contain.text', nome)
  })
})

Then('vejo a mensagem {string}', (mensagem: string) => {
  loginPage.verificarMensagemErro(mensagem)
})

Then('vejo aviso de campo obrigatório', () => {
  // A classe p.input__warging inicia vazia e depois passa a conter o texto 'É campo obrigatório'
  cy.get('p.input__warging')
    .should('contain.text', 'É campo obrigatório')
})

Then('vejo mensagem de erro de usuário inválido', () => {
  cy.get('#modalText')
    .should('be.visible')
    .and('contain.text', 'Usuário ou senha inválido')
})

Then('vejo mensagem de erro de credenciais inválidas', () => {
  cy.get('#modalText')
    .should('be.visible')
    .and('contain.text', 'Usuário ou senha inválido')
})
