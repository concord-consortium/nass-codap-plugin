import { codapInterface } from "./codapInterface";

const dataSetName = "NASS Quickstats Data";
const dataSetTitle = "NASS Quickstats Data";

export const connect = {
    initialize: async function () {
        return await codapInterface.init(this.iFrameDescriptor, null);
    },

    makeCODAPAttributeDef: function (attr) {
      return {
        name: attr,
        type: "numeric"
      }
    },

    createNewDataContext: async function () {
      return codapInterface.sendRequest({
          action: 'create',
          resource: 'dataContext',
          values: {
            name: dataSetName,
            title: dataSetTitle
          }
      });
    },

    deleteOldDataContext: async function () {
      return codapInterface.sendRequest({
        action: 'delete',
        resource: `dataContext[${dataSetName}]`
      });
    },

    checkIfDataContextExists: async function () {
      const response = await codapInterface.sendRequest({
        action: 'get',
        resource: `dataContext[${dataSetName}]`});
      return response;
    },

    getNewDataContext: async function () {
      const doesDataContextExist = await this.checkIfDataContextExists();
      if (doesDataContextExist.success) {
        await connect.deleteOldDataContext();
      }
      const res = await connect.createNewDataContext();
      return res;
    },

    createStateCollection: async function (createBoundaries) {
      const attrs = [{"name": "State"}];

      if (createBoundaries) {
        attrs.push({
          "name": "Boundary",
          "formula": `lookupBoundary(US_state_boundaries, State)`,
          "formulaDependents": "State"
        });
      }

      const message = {
        "action": "create",
        "resource": `dataContext[${dataSetName}].collection`,
        "values": {
          "name": "States",
          "parent": "_root_",
          "attributes": attrs
        }
      };

      await codapInterface.sendRequest(message);
    },

    createCountyCollection: async function() {
      const message = {
        "action": "create",
        "resource": `dataContext[${dataSetName}].collection`,
        "values": {
          "name": "Counties",
          "parent": "States",
          "attributes": [{
            "name": "County",
          },
          {
            "name": "Boundary",
            "formula": `lookupBoundary(US_county_boundaries, County + ', ' + State)`,
            "formulaDependents": "State"
          }]
        }
      };
      await codapInterface.sendRequest(message);
    },

    createSubCollection: async function(geoLevel, attrs) {
      const plural = geoLevel === "State" ? "States" : "Counties";
      const message = {
        "action": "create",
        "resource": `dataContext[${dataSetName}].collection`,
        "values": {
          "name": "Data",
          "parent": plural,
          "attributes": attrs.map((attr) => this.makeCODAPAttributeDef(attr))
        }
      };
      await codapInterface.sendRequest(message);
    },

    createItems: async function(items) {
      for (const item of items) {
        const message = {
          "action": "create",
          "resource": `dataContext[${dataSetName}].item`,
          "values": item
        };
        await codapInterface.sendRequest(message);
      }
    },

    makeCaseTableAppear : async function() {
      const theMessage = {
        action : "create",
        resource : "component",
        values : {
          type : 'caseTable',
          dataContext : dataSetName,
          name : dataSetName,
          title: dataSetName,
          cannotClose : false
        }
      };

      const makeCaseTableResult = await codapInterface.sendRequest(theMessage);
      if (makeCaseTableResult.success) {
        console.log("Success creating case table: " + theMessage.title);
      } else {
        console.log("FAILED to create case table: " + theMessage.title);
      }
      return makeCaseTableResult.success && makeCaseTableResult.values.id;
    },

    iFrameDescriptor: {
      version: '0.0.1',
      name: 'nass-plugin',
      title: 'NASS Quickstats Data'
    },
}
