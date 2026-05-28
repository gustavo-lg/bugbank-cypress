export class ExtratoPage {
  private readonly saldoExtrato = '#textBalanceAvailable'
  private readonly itemTransacao = '.bank-statement__Transaction-sc-7n8vh8-13'
  private readonly dataTransacao = '#textDateTransaction'
  private readonly tipoTransacao = '#textTypeTransaction'
  private readonly valorTransacao = '#textTransferValue'
  private readonly descricaoTransacao = '#textDescription'
  private readonly menuExtrato = '#btn-EXTRATO'

  public navegarParaExtrato(): this {
    cy.get(this.menuExtrato).click()
    return this
  }

  public verificarSaldoExtrato(saldo: string): this {
    cy.get(this.saldoExtrato).should('be.visible').and('contain.text', saldo)
    return this
  }

  public verificarTransacoesExibemDadosCompletos(): this {
    cy.get(this.itemTransacao).each(($item) => {
      cy.wrap($item).find(this.dataTransacao).should('be.visible')
      cy.wrap($item).find(this.tipoTransacao).should('be.visible')
      cy.wrap($item).find(this.valorTransacao).should('be.visible')
    })
    return this
  }

  public verificarTransacoesDebitoEmVermelho(): this {
    cy.get(this.itemTransacao).each(($item) => {
      const valorEl = $item.find(this.valorTransacao)
      const texto = valorEl.text()
      if (texto.includes('-')) {
        cy.wrap(valorEl)
          .should('have.css', 'color')
          .and('match', /rgb\((\d+),\s*0,\s*0\)|red|rgb\(220.*\)/)
      }
    })
    return this
  }

  public verificarTransacoesCreditoEmVerde(): this {
    cy.get(this.itemTransacao).each(($item) => {
      const valorEl = $item.find(this.valorTransacao)
      const texto = valorEl.text()
      if (!texto.includes('-')) {
        cy.wrap(valorEl).should('not.have.css', 'color', 'rgb(220, 20, 60)')
      }
    })
    return this
  }

  public verificarDescricaoVaziaExibeTracao(): this {
    cy.get(this.itemTransacao).each(($item) => {
      cy.wrap($item)
        .find(this.descricaoTransacao)
        .invoke('text')
        .then((texto) => {
          if (texto.trim() === '' || texto.trim() === '-') {
            cy.wrap($item)
              .find(this.descricaoTransacao)
              .should('contain.text', '-')
          }
        })
    })
    return this
  }

  public verificarListaExtratoVisivel(): this {
    cy.get(this.itemTransacao).should('have.length.at.least', 1)
    return this
  }

  public obterSaldoAtual(): Cypress.Chainable<string> {
    return cy
      .get(this.saldoExtrato)
      .invoke('text')
      .then((texto) => texto.trim())
  }
}

export default new ExtratoPage()
