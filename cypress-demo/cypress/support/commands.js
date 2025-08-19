// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to get elements by data-testid attribute
Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Custom command to click on a button
Cypress.Commands.add("clickNumber", (number) => {
  cy.getByTestId(`btn-${number}`).click();
});

// Custom command to click on an operator button
Cypress.Commands.add('clickOperator', (operator) => {
    const operatorMap = {
      '+': 'btn-add',
      '-': 'btn-subtract', 
      'x': 'btn-multiply',
      '÷': 'btn-divide',
      '=': 'btn-equals',
      '%': 'btn-percentage',
      '+/-': 'btn-toggle-sign',
      ',': 'btn-decimal'
    }
  cy.getByTestId(operatorMap[operator]).click();
});

// Custom command to perform a calculation
Cypress.Commands.add('performCalculation', (firstNumber, operator, secondNumber) => {
    cy.clickNumber(firstNumber);
    cy.clickOperator(operator);
    cy.clickNumber(secondNumber);
    cy.clickOperator("=");
});