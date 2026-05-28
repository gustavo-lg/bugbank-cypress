/**
 * LoginPage — Page Object para a tela de Login do BugBank
 * Encapsula todos os seletores e ações relacionados ao login.
 */
export class LoginPage {
  // ─── Seletores ────────────────────────────────────────────────────────────────
  private readonly campoEmail = '.card__login form input[name="email"]'
  private readonly campoSenha = '.card__login form input[name="password"]'
  private readonly botaoAcessar = '.card__login form button[type="submit"]'
  private readonly botaoCadastrar = '.login__buttons button[type="button"]'
  private readonly mensagemErro = '#modalText'
  private readonly botaoFecharModal = '#btnCloseModal'

  // ─── Ações ────────────────────────────────────────────────────────────────────

  /**
   * Navega para a página inicial do BugBank (tela de login).
   */
  public acessarPagina(): this {
    cy.visit('/')
    return this
  }

  /**
   * Preenche o campo E-mail com o valor informado.
   */
  public preencherEmail(email: string): this {
    cy.get(this.campoEmail).clear().type(email)
    return this
  }

  /**
   * Preenche o campo Senha com o valor informado.
   */
  public preencherSenha(senha: string): this {
    cy.get(this.campoSenha).clear().type(senha)
    return this
  }

  /**
   * Clica no botão "Acessar" para submeter o formulário de login.
   */
  public clicarAcessar(): this {
    cy.get(this.botaoAcessar).click()
    return this
  }

  /**
   * Clica no botão "Cadastrar" para ir ao formulário de cadastro.
   */
  public clicarCadastrar(): this {
    cy.get(this.botaoCadastrar).click()
    return this
  }

  /**
   * Limpa o campo E-mail sem preenchê-lo.
   */
  public limparEmail(): this {
    cy.get(this.campoEmail).clear()
    return this
  }

  /**
   * Limpa o campo Senha sem preenchê-lo.
   */
  public limparSenha(): this {
    cy.get(this.campoSenha).clear()
    return this
  }

  /**
   * Fecha o modal de erro/aviso.
   */
  public fecharModal(): this {
    cy.get(this.botaoFecharModal).click()
    return this
  }

  // ─── Verificações ─────────────────────────────────────────────────────────────

  /**
   * Verifica se a mensagem de erro exibida no modal corresponde ao texto esperado.
   */
  public verificarMensagemErro(mensagem: string): this {
    cy.get(this.mensagemErro).should('be.visible').and('contain.text', mensagem)
    return this
  }

}

export default new LoginPage()
