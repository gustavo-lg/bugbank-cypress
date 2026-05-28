import './commands'

beforeEach(() => {
  cy.clearLocalStorage()
})

Cypress.on('uncaught:exception', (err) => {
  const knownErrors = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
  ]
  if (knownErrors.some((msg) => err.message.includes(msg))) {
    return false
  }
  return true
})

export {}
