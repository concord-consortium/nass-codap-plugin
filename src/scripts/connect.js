import { codapInterface } from "./codapInterface";

const dataSetName = "NASS Quickstats Data";
const dataSetTitle = "NASS Quickstats Data";

export const connect = {
    initialize: async function () {
        return await codapInterface.init(this.iFrameDescriptor, null);
    },

    makeCODAPAttributeDef: function (attr) {
      return {
        name: attr.title,
        title: attr.title,
        description: attr.description,
        type: attr.format,
        formula: attr.formula
      }
    },

    createNewDataset: async function (geoLevel) {
      const geoLabel = geoLevel === "State" ? states : "Counties";
      return codapInterface.sendRequest({
          action: 'create',
          resource: 'dataContext',
          values: {
            name: dataSetName,
            title: dataSetTitle,
            collections: [{
              name: geoLabel,
              attrs: [
                {
                  name: geoLevel,
                  title: geoLevel,
                  description: `Selected ${geoLabel}`
                },
                {
                  name: "Boundaries",
                  title: "Boundaries",
                  formula: 'lookupBoundary(US_state_boundaries, State)',
                  formulaDependents: 'State'
                }
              ]
            }, {
              name: "Data",
              parent: geoLabel,
              attrs: [ // note how this is an array of objects.
                {name: "Year", title: "Year"}
              ]
            }]
          }
      });
    },


    guaranteeDataset: async function (geoLevel) {
      let datasetResource = 'dataContext[' + dataSetName +
          ']';
      await this.createNewDataset(geoLevel);
      const response = await codapInterface.sendRequest({
        action: 'get',
        resource: datasetResource});
      return response;
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
          cannotClose : true
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

    createNewCollection: async function(dSName, collName) {
      const message = {
        "action": "create",
        "resource": `dataContext[${dSName}].collection`,
        "values": {
          "name": collName,
          "attributes": [{
            "name": "newAttr",
          }]
        }
      };
      await codapInterface.sendRequest(message);
    },

    createNewAttribute: async function(dSName, collName, attrName) {
      const message = {
        "action": "create",
        "resource": `dataContext[${dSName}].collection[${collName}].attribute`,
        "values": {
          "name": attrName,
        }
      };
      await codapInterface.sendRequest(message);
    },

    iFrameDescriptor: {
      version: '0.0.1',
      name: 'nass-plugin',
      title: 'NASS Quickstats Data'
    },
}
