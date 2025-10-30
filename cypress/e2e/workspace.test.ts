context("Test the overall app", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("App loads properly", () => {
    it("renders with descriptive text", () => {
      cy.get(".app-sectionHeaderText").should("have.text", "Retrieve data on U.S. agricultural statistics at the state or county level.");
    });
    it("renders with three dropdown sections: Place, Attributes, and Years", () => {
      cy.get(".dropdown-dropdown").should("have.length", 3);
      cy.get(".dropdown-dropdown").eq(0).contains("Place");
      cy.get(".dropdown-dropdown").eq(1).contains("Attributes");
      cy.get(".dropdown-dropdown").eq(2).contains("Years");
    });
    it("renders with a 'Get Data' button", () => {
      cy.get("button").contains("Get Data");
    });
  });
});
