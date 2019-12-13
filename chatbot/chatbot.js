'use strict'

const dialogflow = require('dialogflow');
const config = require('../config/keys');
const structjson = require('structjson');

const sessionClient = new dialogflow.SessionsClient();

const sessionPath = sessionClient.sessionPath(config.googleProjectId, config.dialogFlowSessionId);

module.exports = {
  textQuery: async function (text, parameters = {}){
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {        
          text: text,          
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data : parameters
        }
      }
    };
    let responses = await sessionClient.detectIntent(request);
    //const result = responses[0].queryResult; 
    responses = await self.handleAction(responses);
    return responses;
  },

  eventQuery: async function (event, parameters = {}){
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {        
          name: event,
          parameters: structjson.jsonToStructProto(parameters),          
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
      queryParams: {
        payload: {
          data : parameters
        }
      }
    };
    let responses = await sessionClient.detectIntent(request);
    //const result = responses[0].queryResult; 
    responses = await self.handleAction(responses);
    return responses;
  },

  handleAction: function(responses){
    return responses;
  }
}