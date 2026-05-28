/**
 * CadastroPage — Page Object para a tela de Cadastro do BugBank
 * Encapsula todos os seletores e ações relacionados ao cadastro de usuários.
 */
export class CadastroPage {
  // ─── Seletores ────────────────────────────────────────────────────────────────
  private readonly campoNome = '.card__register form input[name="name"]'
  private readonly campoEmail = '.card__register form input[name="email"]'
  private readonly campoSenha = '.card__register form input[name="password"]'
  private readonly campoConfirmarSenha = '.card__register form input[name="passwordConfirmation"]'
  private readonly toggleSaldo = '.card__register #toggleAddBalance'
  private readonly botaoCadastrar = '.card__register form button[type="submit"]'
  private readonly mensagemModal = '#modalText'
  private readonly botaoFecharModal = '#btnCloseModal'

  // ─── Ações ────────────────────────────────────────────────────────────────────

  /**
   * Preenche o campo Nome com o valor informado.
   */
  public preencherNome(nome: string): this {
    // O BugBank usa backface-visibility:hidden no card flip — { force: true } é necessário
    cy.get(this.campoNome).clear({ force: true }).type(nome, { force: true })
    return this
  }

  /**
   * Preenche o campo E-mail com o valor informado.
   */
  public preencherEmail(email: string): this {
    cy.get(this.campoEmail).clear({ force: true }).type(email, { force: true })
    return this
  }

  /**
   * Preenche o campo Senha com o valor informado.
   */
  public preencherSenha(senha: string): this {
    cy.get(this.campoSenha).clear({ force: true }).type(senha, { force: true })
    return this
  }

  /**
   * Preenche o campo Confirmar Senha com o valor informado.
   */
  public preencherConfirmarSenha(senha: string): this {
    cy.get(this.campoConfirmarSenha).clear({ force: true }).type(senha, { force: true })
    return this
  }

  /**
   * Ativa o toggle "Criar conta com saldo" se ainda não estiver ativo.
   */
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

  /**
   * Clica no botão "Cadastrar" para submeter o formulário.
   */
  public clicarCadastrar(): this {
    cy.get(this.botaoCadastrar).click({ force: true })
    return this
  }

  /**
   * Limpa o campo Nome sem preenchê-lo.
   */
  public limparNome(): this {
    cy.get(this.campoNome).clear({ force: true })
    return this
  }

  /**
   * Limpa o campo E-mail sem preenchê-lo.
   */
  public limparEmail(): this {
    cy.get(this.campoEmail).clear({ force: true })
    return this
  }

  /**
   * Limpa o campo Senha sem preenchê-lo.
   */
  public limparSenha(): this {
    cy.get(this.campoSenha).clear({ force: true })
    return this
  }

  /**
   * Limpa o campo Confirmar Senha sem preenchê-lo.
   */
  public limparConfirmarSenha(): this {
    cy.get(this.campoConfirmarSenha).clear({ force: true })
    return this
  }

  /**
   * Fecha o modal de resultado.
   */
  public fecharModal(): this {
    cy.get(this.botaoFecharModal).click()
    return this
  }

  /**
   * Preenche todos os campos do formulário de cadastro.
   */
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

  // ─── Verificações ─────────────────────────────────────────────────────────────

  /**
   * Verifica se a mensagem do modal corresponde ao texto esperado.
   */
  public verificarMensagemModal(mensagem: string): this {
    cy.get(this.mensagemModal).should('be.visible').and('contain.text', mensagem)
    return this
  }

  /**
   * Verifica se o número da conta foi exibido no modal de sucesso.
   * O número da conta é exibido no título ou no corpo do modal.
   */
  public verificarContaCriada(): this {
    cy.get(this.mensagemModal)
      .should('be.visible')
      .invoke('text')
      .should('match', /^A conta \d{3,4}-\d foi criada com sucesso$/)
    return this
  }

  /**
   * Verifica mensagem de erro de validação exibida abaixo do campo.
   */
  public verificarMensagemValidacao(mensagem: string): this {
    cy.contains(mensagem).should('be.visible')
    return this
  }
}

export default new CadastroPage()
