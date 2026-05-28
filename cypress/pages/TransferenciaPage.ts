/**
 * TransferenciaPage — Page Object para a tela de Transferência do BugBank
 * Encapsula todos os seletores e ações relacionados à realização de transferências.
 */
export class TransferenciaPage {
  // ─── Seletores ────────────────────────────────────────────────────────────────
  private readonly campoContaDestino = 'input[name="accountNumber"]'
  private readonly campoDigitoDestino = 'input[name="digit"]'
  private readonly campoValor = 'input[name="transferValue"]'
  private readonly campoDescricao = 'input[name="description"]'
  private readonly botaoTransferir = 'button[type="submit"]'
  private readonly mensagemModal = '#modalText'
  private readonly tituloModal = '#modalText'
  private readonly botaoFecharModal = '#btnCloseModal'
  private readonly saldoHome = '#textBalance'
  private readonly menuTransferencia = '#btn-TRANSFERÊNCIA'

  // ─── Navegação ────────────────────────────────────────────────────────────────

  /**
   * Clica no menu de transferência na barra de navegação.
   */
  public navegarParaTransferencia(): this {
    cy.get(this.menuTransferencia).click()
    cy.url().should('include', '/transfer')
    return this
  }

  // ─── Ações ────────────────────────────────────────────────────────────────────

  /**
   * Preenche o número da conta destino (parte antes do dígito).
   */
  public preencherContaDestino(conta: string): this {
    const partes = conta.split('-')
    cy.get(this.campoContaDestino).clear().type(partes[0])
    if (partes[1]) {
      cy.get(this.campoDigitoDestino).clear().type(partes[1])
    }
    return this
  }

  /**
   * Tenta digitar texto no campo de conta (para validar que apenas números são aceitos).
   */
  public tentarDigitarNaConta(texto: string): this {
    cy.get(this.campoContaDestino).clear().type(texto)
    return this
  }

  /**
   * Preenche o valor da transferência.
   */
  public preencherValor(valor: string): this {
    cy.get(this.campoValor).clear().type(valor)
    return this
  }

  /**
   * Preenche o campo Descrição da transferência.
   */
  public preencherDescricao(descricao: string): this {
    cy.get(this.campoDescricao).clear().type(descricao)
    return this
  }

  /**
   * Limpa o campo Descrição sem preenchê-lo.
   */
  public limparDescricao(): this {
    cy.get(this.campoDescricao).clear()
    return this
  }

  /**
   * Clica no botão "Transferir agora".
   */
  public clicarTransferir(): this {
    cy.get(this.botaoTransferir).click()
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
   * Preenche todos os campos de transferência.
   */
  public preencherTransferenciaCompleta(
    conta: string,
    valor: string,
    descricao: string
  ): this {
    this.preencherContaDestino(conta)
    this.preencherValor(valor)
    this.preencherDescricao(descricao)
    return this
  }

  // ─── Verificações ─────────────────────────────────────────────────────────────

  /**
   * Verifica se a mensagem exibida no modal corresponde ao texto esperado.
   */
  public verificarMensagemModal(mensagem: string): this {
    cy.get(this.mensagemModal).should('be.visible').and('contain.text', mensagem)
    return this
  }

  /**
   * Verifica se o modal de sucesso de transferência está visível.
   */
  public verificarTransferenciaRealizada(): this {
    cy.get(this.tituloModal)
      .should('be.visible')
      .and('contain.text', 'Transferencia realizada')
    return this
  }

  public verificarCampoContaApenasNumeros(): this {
    cy.wait(1000)
    cy.get(this.campoContaDestino)
      .invoke('val')
      .then((valor) => {
        expect(valor, 'ERRO: O sistema permitiu TEXTO no campo da conta! O campo deveria estar vazio.').to.be.empty
      })
    return this
  }

  /**
   * Verifica o saldo exibido na tela home.
   */
  public verificarSaldo(saldoEsperado: string): this {
    cy.get(this.saldoHome).should('contain.text', saldoEsperado)
    return this
  }
}

export default new TransferenciaPage()
