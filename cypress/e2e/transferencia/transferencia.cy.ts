import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import transferenciaPage from '../../pages/TransferenciaPage'
import extratoPage from '../../pages/ExtratoPage'

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface TransferenciaValida {
  valor: string
  descricao: string
}

interface TransferenciaInvalida {
  conta: string
  valor: string
  descricao: string
}

// Schema real do BugBank (chave = email do usuário)
interface BugBankUser {
  name: string
  email: string
  password: string
  accountNumber: string
  balance: number
  logged: boolean
}

// ─── Conta destino fixa usada como alvo de transferências ────────────────────
const EMAIL_DESTINO = 'destino@bugbank.com'
const ACCOUNT_DESTINO = '2222-1'

function criarContaDestinoSeNecessario(win: Window): void {
  if (!win.localStorage.getItem(EMAIL_DESTINO)) {
    win.localStorage.setItem(
      EMAIL_DESTINO,
      JSON.stringify({
        name: 'Conta Destino',
        email: EMAIL_DESTINO,
        password: 'Senha@999',
        accountNumber: ACCOUNT_DESTINO,
        balance: 0,
        logged: false,
      } satisfies BugBankUser)
    )
    win.localStorage.setItem(`transaction:${EMAIL_DESTINO}`, JSON.stringify([]))
  }
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

Given('que o usuário está logado e na tela de Transferência', () => {
  const uid = Date.now()
  const email = `user_${uid}@bugbank.com`
  const senha = 'Senha@123'

  // Alias para uso nos steps seguintes
  cy.wrap(email).as('registeredEmail')

  // 1- Cadastrar um usuário com saldo
  cy.cadastrarUsuario('Usuario Teste', email, senha, true)
  cy.get('#btnCloseModal').click()

  // 2- Logar com o usuário
  cy.get('.card__login form input[name="email"]').clear().type(email)
  cy.get('.card__login form input[name="password"]').clear().type(senha)
  cy.get('.card__login form button[type="submit"]').click()
  cy.get('#textBalance').should('be.visible')

  // 3- Ir para a tela de transferência
  transferenciaPage.navegarParaTransferencia()
})

// ─── Steps que ajustam o saldo antes do cenário ───────────────────────────────

When('o saldo da conta é {string}', (saldo: string) => {
  const valorNumerico = parseFloat(
    saldo.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
  )

  cy.get<string>('@registeredEmail').then((email) => {
    cy.window().then((win) => {
      // Garante a sessão ativa do usuário no localStorage
      win.localStorage.setItem('logged', email)
      const userRaw = win.localStorage.getItem(email)
      if (userRaw) {
        const user = JSON.parse(userRaw) as BugBankUser
        user.balance = valorNumerico
        user.logged = true
        win.localStorage.setItem(email, JSON.stringify(user))
      }
    })
  })
})

// ─── Steps de Ação ────────────────────────────────────────────────────────────

When('preencho todos os campos corretamente', () => {
  cy.fixture<{ valida: TransferenciaValida }>('transferencia').then(({ valida }) => {
    cy.window().then((win) => {
      criarContaDestinoSeNecessario(win)
    })
    transferenciaPage.preencherTransferenciaCompleta(
      ACCOUNT_DESTINO,
      valida.valor,
      valida.descricao
    )
  })
})

When('insiro a conta destino {string}', (conta: string) => {
  transferenciaPage.preencherContaDestino(conta)
})

When('preencho os demais campos corretamente', () => {
  cy.fixture<{ invalida: TransferenciaInvalida }>('transferencia').then(({ invalida }) => {
    transferenciaPage.preencherValor(invalida.valor).preencherDescricao(invalida.descricao)
  })
})

When('insiro o valor {string}', (valor: string) => {
  cy.fixture<{ invalida: TransferenciaInvalida }>('transferencia').then(({ invalida }) => {
    cy.window().then((win) => {
      criarContaDestinoSeNecessario(win)
    })
    transferenciaPage
      .preencherContaDestino(ACCOUNT_DESTINO)
      .preencherValor(valor)
      .preencherDescricao(invalida.descricao)
  })
})

When('clico em {string}', (botao: string) => {
  if (botao === 'Transferir agora') {
    transferenciaPage.clicarTransferir()
  }
})

When('preencho conta e valor corretamente', () => {
  cy.window().then((win) => {
    criarContaDestinoSeNecessario(win)
    transferenciaPage
      .preencherContaDestino(ACCOUNT_DESTINO)
      .preencherValor('100')
  })
})

When('deixo o campo {string} em branco', (campo: string) => {
  if (campo === 'Descrição') {
    transferenciaPage.limparDescricao()
  }
})

When('preencho conta e valor corretamente mas deixo o valor em branco', () => {
  cy.window().then((win) => {
    criarContaDestinoSeNecessario(win)
    transferenciaPage.preencherContaDestino(ACCOUNT_DESTINO)
  })
})

When('tento inserir {string} no campo número da conta', (texto: string) => {
  transferenciaPage.tentarDigitarNaConta(texto)
})

// ─── Steps de Verificação ─────────────────────────────────────────────────────

Then('vejo a mensagem {string}', (mensagem: string) => {
  transferenciaPage.verificarMensagemModal(mensagem)
})

Then('sou redirecionado para a tela de Extrato', () => {
  transferenciaPage.fecharModal()
  cy.url().should('include', '/bank-statement')
})

Then('o saldo é debitado corretamente', () => {
  extratoPage.verificarListaExtratoVisivel()
})


Then('a transferência é realizada com sucesso', () => {
  transferenciaPage.verificarTransferenciaRealizada()
})

Then('o saldo resultante é {string}', (saldoEsperado: string) => {
  cy.get('#btnCloseModal').click()
  cy.get('#btnBack').click()
  cy.get('#textBalance')
    .should('be.visible')
    .and('contain.text', saldoEsperado)
})

Then('vejo mensagem de valor inválido', () => {
  cy.get('#modalText')
    .should('be.visible')
    .and('have.text', 'Valor da transferência não pode ser 0 ou negativo')
})


Then('vejo erro de validação no campo Valor', () => {
  cy.get('p.input__warging')
    .should('be.visible')
    .invoke('text')
    .should('include', 'NaN')
})

Then('os caracteres não são aceitos', () => {
  transferenciaPage.verificarCampoContaApenasNumeros()
})
