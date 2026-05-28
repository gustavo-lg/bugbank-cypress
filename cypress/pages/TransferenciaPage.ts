export class TransferenciaPage {
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

  public navegarParaTransferencia(): this {
    cy.get(this.menuTransferencia).click()
    cy.url().should('include', '/transfer')
    return this
  }

  public preencherContaDestino(conta: string): this {
    const partes = conta.split('-')
    cy.get(this.campoContaDestino).clear().type(partes[0])
    if (partes[1]) {
      cy.get(this.campoDigitoDestino).clear().type(partes[1])
    }
    return this
  }

  public tentarDigitarNaConta(texto: string): this {
    cy.get(this.campoContaDestino).clear().type(texto)
    return this
  }

  public preencherValor(valor: string): this {
    cy.get(this.campoValor).clear().type(valor)
    return this
  }

  public preencherDescricao(descricao: string): this {
    cy.get(this.campoDescricao).clear().type(descricao)
    return this
  }

  public limparDescricao(): this {
    cy.get(this.campoDescricao).clear()
    return this
  }

  public clicarTransferir(): this {
    cy.get(this.botaoTransferir).click()
    return this
  }

  public fecharModal(): this {
    cy.get(this.botaoFecharModal).click()
    return this
  }

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

  public verificarMensagemModal(mensagem: string): this {
    cy.get(this.mensagemModal).should('be.visible').and('contain.text', mensagem)
    return this
  }

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

  public verificarSaldo(saldoEsperado: string): this {
    cy.get(this.saldoHome).should('contain.text', saldoEsperado)
    return this
  }
}

export default new TransferenciaPage()
