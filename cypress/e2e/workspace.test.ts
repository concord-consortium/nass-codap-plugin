context("Test the overall app", () => {
  beforeEach(() => {
    cy.visit("");
  });

  const verifyCheckboxAndLabel = (sectionName: string, value: string) => {
    cy.get(`[data-testid^='dropdown-${sectionName}-body'] input[type='checkbox'][value='${value}']`).should("exist");
    cy.get(`[data-testid^='dropdown-${sectionName}-body'] label[for='${value}']`).should("contain.text", value);
  };

  const verifyRadioButtonAndLabel = (sectionName: string, value: string) => {
    cy.get(`[data-testid^='dropdown-${sectionName}-body'] input[type='radio'][value='${value}']`).should("exist");
    cy.get(`[data-testid^='dropdown-${sectionName}-body'] label[for='${value}']`).should("contain.text", value);
  };

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

    it("renders with Place selection area hidden initially", () => {
      cy.get("[data-testid^='dropdown-Place-header']").should("be.visible");
      cy.get("[data-testid^='dropdown-Place-body']").should("not.be.visible");
    });

    it("renders with Attributes selection area hidden initially", () => {
      cy.get("[data-testid^='dropdown-Attributes-header']").should("be.visible");
      cy.get("[data-testid^='dropdown-Attributes-body']").should("not.be.visible");
    });

    it("renders with Years selection area hidden initially", () => {
      cy.get("[data-testid^='dropdown-Years-header']").should("be.visible");
      cy.get("[data-testid^='dropdown-Years-body']").should("not.be.visible");
    });

    it("renders with a 'Get Data' button", () => {
      cy.get("button").contains("Get Data");
    });
  });

  describe("Dropdown functionality", () => {
    it("expands and collapses Place section when clicked", () => {
      cy.get("[data-testid^='dropdown-Place-toggle']").click();
      cy.get("[data-testid^='dropdown-Place-body']").should("be.visible");

      // Check size of area options
      cy.get("[data-testid^='dropdown-Place-body']").should("contain.text", "Size of area for data:");
      const sizes = ["National", "State", "County"];
      sizes.forEach(size => verifyRadioButtonAndLabel("Place", size));

      // Check state options
      cy.get("[data-testid^='dropdown-Place-body']").should("contain.text", "Choose states to include in your dataset from the list below:");
      verifyRadioButtonAndLabel("Place", "All States");
      const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
      states.forEach(state => verifyCheckboxAndLabel("Place", state));

      cy.get("[data-testid^='dropdown-Place-toggle']").click();
      cy.get("[data-testid^='dropdown-Place-body']").should("not.be.visible");
    });

    it("expands and collapses Attributes section when clicked", () => {
      cy.get("[data-testid^='dropdown-Attributes-toggle']").click();
      cy.get("[data-testid^='dropdown-Attributes-body']").should("be.visible");
      cy.get("[data-testid^='dropdown-Attributes-body']").should("contain.text", "Choose attributes to include in your dataset from the list below.");
      
      // Check section headers
      const sectionHeaders = ["Farmer Demographics", "Farm Demographics", "Economics & Wages", "Crop Production"];
      sectionHeaders.forEach(header => {
        cy.get("[data-testid^='dropdown-Attributes-body']").should("contain.text", header);
      });

      // Check for all attribute checkboxes
      const attributes = [
        // Farmer Demographics
        "Total Farmers", "Age", "Race", "Gender",
        // Farm Demographics  
        "Total Farms", "Organization Type", "Economic Class", "Acres Operated", "Organic",
        // Economics & Wages
        "Labor Status", "Wages", "Time Worked",
        // Crop Production - unit
        "Area Harvested", "Yield",
        // Crop Production - crops
        "Corn", "Cotton", "Grapes", "Hay", "Oats", "Soybeans", "Tobacco", "Wheat",
        // Livestock
        "Cattle", "Chickens", "Hogs", "Horses & Ponies"
      ];
      
      attributes.forEach(attr => verifyCheckboxAndLabel("Attributes", attr));

      cy.get("[data-testid^='dropdown-Attributes-toggle']").click();
      cy.get("[data-testid^='dropdown-Attributes-body']").should("not.be.visible");
    });

    it("expands and collapses Years section when clicked", () => {
      cy.get("[data-testid^='dropdown-Years-toggle']").click();
      cy.get("[data-testid^='dropdown-Years-body']").should("be.visible");
      cy.get("[data-testid^='dropdown-Years-body']").should("contain.text", "Please select attributes to see available years.");
      cy.get("[data-testid^='dropdown-Years-toggle']").click();
      cy.get("[data-testid^='dropdown-Years-body']").should("not.be.visible");
    });
  });
});
