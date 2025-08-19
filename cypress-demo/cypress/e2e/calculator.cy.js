describe("iPhone Calculator", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the calculator correctly", () => {
    cy.getByTestId("calculator-display").should("contain", "0");
  });

  it('should insert numbers correctly', () => {
    cy.clickNumber("1");
    cy.clickNumber("2");
    cy.clickNumber("3");
    cy.getByTestId("calculator-display").should("contain", "123");
  });

  it('should add numbers correctly', () => {
    cy.performCalculation("1", "+", "2");
    cy.getByTestId("calculator-display").should("contain", "3");
  });

  it('should subtract numbers correctly', () => {
    cy.performCalculation("1", "-", "2");
    cy.getByTestId("calculator-display").should("contain", "-1");
  });

  it('should multiply numbers correctly', () => {
    cy.performCalculation("1", "x", "2");
    cy.getByTestId("calculator-display").should("contain", "2");
  });

  it('should divide numbers correctly', () => {
    cy.performCalculation("5", "÷", "2");
    cy.getByTestId("calculator-display").should("contain", "2,5");
  });
  
  it('should handle decimal numbers correctly', () => {
    cy.clickNumber("1");
    cy.clickOperator(",");
    cy.clickNumber("2");
    cy.getByTestId("calculator-display").should("contain", "1,2");
  });
  
  it('should handle percentage correctly', () => {
    cy.clickNumber("1");
    cy.clickOperator("%");
    cy.getByTestId("calculator-display").should("contain", "0,01");
  });
  
  
  it('should handle negative numbers correctly', () => {
    cy.clickNumber("1");
    cy.clickOperator("+/-");
    cy.getByTestId("calculator-display").should("contain", "-1");
  });
});
