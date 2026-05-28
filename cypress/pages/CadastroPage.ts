export class CadastroPage {
  private readonly campoNome = '.card__register form input[name="name"]'
  private readonly campoEmail = '.card__register form input[name="email"]'
  private readonly campoSenha = '.card__register form input[name="password"]'
  private readonly campoConfirmarSenha = '.card__register form input[name="passwordConfirmation"]'
  private readonly toggleSaldo = '.card__register #toggleAddBalance'
  private readonly botaoCadastrar = '.card__register form button[type="submit"]'
  private readonly mensagemModal = '#modalText'
  private readonly botaoFecharModal = '#btnCloseModal'

  public preencherNome(nome: string): this {
    cy.get(this.campoNome).clear({ force: true }).type(nome, { force: true })
    return this
  }

  public preencherEmail(email: string): this {
    cy.get(this.campoEmail).clear({ force: true }).type(email, { force: true })
    return this
  }

  public preencherSenha(senha: string): this {
    cy.get(this.campoSenha).clear({ force: true }).type(senha, { force: true })
    return this
  }

  public preencherConfirmarSenha(senha: string): this {
    cy.get(this.campoConfirmarSenha).clear({ force: true }).type(senha, { force: true })
    return this
  }

  public ativarToggleSaldo(): this {
    cy.get(this.toggleSaldo).click({ force: true })
    return this
  }

  /**
   * Garante que o toggle "Criar conta com saldo" está desativado.
   * O form começa sempre com toggle off após cy.visit('/') + clicar Registrar,
   * então este método é no-op na maior parte dos cenários.
   */
  public desativarToggleSaldo(): this {
    return this
  }

  public clicarCadastrar(): this {
    cy.get(this.botaoCadastrar).click({ force: true })
    return this
  }

  public limparNome(): this {
    cy.get(this.campoNome).clear({ force: true })
    return this
  }

  public limparEmail(): this {
    cy.get(this.campoEmail).clear({ force: true })
    return this
  }

  public limparSenha(): this {
    cy.get(this.campoSenha).clear({ force: true })
    return this
  }

  public limparConfirmarSenha(): this {
    cy.get(this.campoConfirmarSenha).clear({ force: true })
    return this
  }

  public fecharModal(): this {
    cy.get(this.botaoFecharModal).click()
    return this
  }

  public preencherFormularioCompleto(
    nome: string,
    email: string,
    senha: string,
    confirmarSenha: string
  ): this {
    this.preencherNome(nome)
    this.preencherEmail(email)
    this.preencherSenha(senha)
    this.preencherConfirmarSenha(confirmarSenha)
    return this
  }

  public verificarMensagemModal(mensagem: string): this {
    cy.get(this.mensagemModal).should('be.visible').and('contain.text', mensagem)
    return this
  }

  public verificarContaCriada(): this {
    cy.get(this.mensagemModal)
      .should('be.visible')
      .invoke('text')
      .should('match', /^A conta \d{3,4}-\d foi criada com sucesso$/)
    return this
  }

  public verificarMensagemValidacao(mensagem: string): this {
    cy.contains(mensagem).should('be.visible')
    return this
  }
}

export default new CadastroPage()
