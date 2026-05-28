export class LoginPage {
  private readonly campoEmail = '.card__login form input[name="email"]'
  private readonly campoSenha = '.card__login form input[name="password"]'
  private readonly botaoAcessar = '.card__login form button[type="submit"]'
  private readonly botaoCadastrar = '.login__buttons button[type="button"]'
  private readonly mensagemErro = '#modalText'
  private readonly botaoFecharModal = '#btnCloseModal'

  public acessarPagina(): this {
    cy.visit('/')
    return this
  }

  public preencherEmail(email: string): this {
    cy.get(this.campoEmail).clear().type(email)
    return this
  }

  public preencherSenha(senha: string): this {
    cy.get(this.campoSenha).clear().type(senha)
    return this
  }

  public clicarAcessar(): this {
    cy.get(this.botaoAcessar).click()
    return this
  }

  public clicarCadastrar(): this {
    cy.get(this.botaoCadastrar).click()
    return this
  }

  public limparEmail(): this {
    cy.get(this.campoEmail).clear()
    return this
  }

  public limparSenha(): this {
    cy.get(this.campoSenha).clear()
    return this
  }

  public fecharModal(): this {
    cy.get(this.botaoFecharModal).click()
    return this
  }

  public verificarMensagemErro(mensagem: string): this {
    cy.get(this.mensagemErro).should('be.visible').and('contain.text', mensagem)
    return this
  }

}

export default new LoginPage()
