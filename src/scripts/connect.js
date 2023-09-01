import { codapInterface } from "./codapInterface";

export const connect = {
    initialize: async function () {
        return await codapInterface.init(this.iFrameDescriptor, null);
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
      title: 'MultiData'
    },
}
