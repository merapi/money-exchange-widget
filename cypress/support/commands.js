import '@testing-library/cypress/add-commands'

Cypress.Commands.add('openExchange', () => {
  cy.findByText(/show exchange/i)
    .click()
    .findAllByText(/you have/i)
    .should('have.length', 2)
})
