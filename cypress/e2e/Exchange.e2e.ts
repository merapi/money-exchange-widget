/// <reference types="Cypress" />

context('Exchange screen', () => {
  beforeEach(() => {
    // cy.visit('/')
  })

  it('Loads accounts', () => {
    cy.visit('/')
    cy.findByText(/Accounts:/)
  })

  it('Loads accounts', () => {
    cy.openExchange()
      .findByTestId('from')
      .type('100{selectall}200.00') //, { delay: 500 }
  })

  it('Should reset', () => {})
})
