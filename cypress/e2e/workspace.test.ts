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

  const makeMinimalSelection = () => {
    cy.get("[data-testid^='dropdown-Attributes-toggle']").click();
    cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Corn']").check();
    cy.get("[data-testid^='dropdown-Attributes-toggle']").click();
    cy.get("[data-testid^='dropdown-Years-toggle']").click();
    cy.get("[data-testid^='dropdown-Years-body'] input[type='checkbox'][value='2023']").check();
    cy.get("[data-testid^='dropdown-Years-toggle']").click();
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

    it("renders with a 'Get Data' and a 'Clear Data Selection' buttons", () => {
      cy.get("[data-testid='get-data-button']").should("be.visible").contains("Get Data");
      cy.get("[data-testid='clear-data-selection-button']").should("be.visible").contains("Clear Data Selection");
    });
  });

  describe("Dropdown functionality", () => {
    it("expands and collapses Place section when clicked", () => {
      cy.get("[data-testid^='dropdown-Place-toggle']").click();
      cy.get("[data-testid^='dropdown-Place-body']").should("be.visible");

      // Check size of area options
      cy.get("[data-testid^='dropdown-Place-body']").should("contain.text", "Size of area for data:");
      const sizes = ["State", "County"];
      sizes.forEach(size => verifyRadioButtonAndLabel("Place", size));

      // Check state options
      cy.get("[data-testid^='dropdown-Place-body']").should("contain.text", "Choose states to include in your dataset from the list below:");
      verifyRadioButtonAndLabel("Place", "All States");
      const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
        "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
        "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
        "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
        "Wisconsin", "Wyoming"
      ];
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
        "Area Harvested", "Production", "Yield",
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

  describe("Buttons functionality", () => {
    it("initially renders both buttons as disabled before selections are made", () => {
      cy.get("[data-testid='get-data-button']").should("be.disabled");
      cy.get("[data-testid='clear-data-selection-button']").should("be.disabled");
    });
    
    it("enables buttons when selections are made", () => {
      makeMinimalSelection();
      cy.get("[data-testid='get-data-button']").should("not.be.disabled");
      cy.get("[data-testid='clear-data-selection-button']").should("not.be.disabled");
    });

    it("clears all selections and disables both buttons when 'Clear Data Selection' is clicked", () => {
      cy.get("[data-testid^='dropdown-Place-toggle']").click();
      cy.get("[data-testid^='dropdown-Place-body'] input[type='checkbox'][value='Texas']").check();
      cy.get("[data-testid^='dropdown-Attributes-toggle']").click();
      cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Corn']").check();
      cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Cattle']").check();

      cy.get("[data-testid^='dropdown-Place-body'] input[type='checkbox'][value='Texas']").should("be.checked");
      cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Corn']").should("be.checked");
      cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Cattle']").should("be.checked");

      cy.get("[data-testid='clear-data-selection-button']").click();
      cy.get("[data-testid^='dropdown-Place-body'] input[type='checkbox'][value='Texas']").should("not.be.checked");
      cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Corn']").should("not.be.checked");
      cy.get("[data-testid^='dropdown-Attributes-body'] input[type='checkbox'][value='Cattle']").should("not.be.checked");
      cy.get("[data-testid='clear-data-selection-button']").should("be.disabled");
    });
  });
});
