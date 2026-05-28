import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import cadastroPage from '../../pages/CadastroPage'
import loginPage from '../../pages/LoginPage'

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface NovoUsuario {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

// Schema real do BugBank (chave = email)
interface BugBankUser {
  email: string
  password: string
  balance: number
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

Given('que estou na página de Cadastro do BugBank', () => {
  cy.visit('/')
  loginPage.clicarCadastrar()
})

// ─── Steps de Ação ────────────────────────────────────────────────────────────

When('preencho todos os campos corretamente', () => {
  cy.fixture<{ novo: NovoUsuario }>('usuarios').then(({ novo }) => {
    const emailUnico = `teste_${Date.now()}@bugbank.com`
    // Alias para uso no step "ao fazer login o saldo exibido é"
    cy.wrap(emailUnico).as('emailCadastrado')
    cadastroPage
      .preencherNome(novo.nome)
      .preencherEmail(emailUnico)
      .preencherSenha(novo.senha)
      .preencherConfirmarSenha(novo.confirmarSenha)
  })
})

When('ativo o toggle {string}', (_nomeToggle: string) => {
  cadastroPage.ativarToggleSaldo()
})

When('mantenho o toggle {string} inativo', (_nomeToggle: string) => {
  cadastroPage.desativarToggleSaldo()
})

When('clico em {string}', (botao: string) => {
  if (botao === 'Cadastrar') {
    cadastroPage.clicarCadastrar()
  }
})

When('deixo o campo {string} em branco', (campo: string) => {
  cy.fixture<{ novo: NovoUsuario }>('usuarios').then(({ novo }) => {
    const emailUnico = `teste_${Date.now()}@bugbank.com`

    cadastroPage
      .preencherNome(novo.nome)
      .preencherEmail(emailUnico)
      .preencherSenha(novo.senha)
      .preencherConfirmarSenha(novo.confirmarSenha)

    switch (campo) {
      case 'Nome':
        cadastroPage.limparNome()
        break
      case 'E-mail':
        cadastroPage.limparEmail()
        break
      case 'Senha':
        cadastroPage.limparSenha()
        break
      case 'Confirmar senha':
        cadastroPage.limparConfirmarSenha()
        break
    }
  })
})

When('preencho os demais campos corretamente', () => {
  // Campos já foram preenchidos no step anterior "deixo o campo X em branco"
})

When('preencho {string} com {string}', (campo: string, valor: string) => {
  const emailUnico = `teste_${Date.now()}@bugbank.com`

  if (campo === 'Senha') {
    cadastroPage
      .preencherNome('Gustavo Teste')
      .preencherEmail(emailUnico)
      .preencherSenha(valor)
  } else if (campo === 'Confirmar senha') {
    cadastroPage.preencherConfirmarSenha(valor)
  }
})

// ─── Steps de Verificação ─────────────────────────────────────────────────────

Then('vejo o número da conta criada', () => {
  cadastroPage.verificarContaCriada()
})

Then('ao fazer login o saldo exibido é {string}', (saldoEsperado: string) => {
  cadastroPage.fecharModal()

  // Usa o alias definido no step "preencho todos os campos corretamente"
  cy.get<string>('@emailCadastrado').then((email) => {
    cy.window().then((win) => {
      const userRaw = win.localStorage.getItem(email)
      if (userRaw) {
        const user = JSON.parse(userRaw) as BugBankUser
        loginPage.preencherEmail(user.email)
        loginPage.preencherSenha(user.password)
        loginPage.clicarAcessar()
        cy.get('#textBalance')
          .should('be.visible')
          .invoke('text')
          .then((texto) => {
            // Normaliza qualquer espaço especial (&nbsp; U+00A0) antes de comparar
            const textoNormalizado = texto.replace(/\u00a0/g, ' ').trim()
            const saldoNormalizado = saldoEsperado.replace(/\u00a0/g, ' ').trim()
            expect(textoNormalizado).to.include(saldoNormalizado)
          })
      }
    })
  })
})

Then('vejo a mensagem {string}', (mensagem: string) => {
  cadastroPage.verificarMensagemValidacao(mensagem)
})

Then('vejo aviso de campo obrigatório', () => {
  // O BugBank exibe aviso inline abaixo do campo — não usa modal.
  // Como no início a tag <p class="input__warging"></p> está vazia,
  // validamos que ela passa a conter o texto 'É campo obrigatório'.
  cy.get('p.input__warging')
    .should('contain.text', 'É campo obrigatório')
})

Then('vejo mensagem de senhas divergentes', () => {
  cy.get('#modalText')
    .should('be.visible')
    .and('contain.text', 'As senhas não são iguais.')
})
