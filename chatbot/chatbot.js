'use strict'

const dialogflow = require('dialogflow');
const config = require('../config/keys');
const structjson = require('structjson');

const projectID = config.googleProjectID;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectID: projectID, credentials: credentials});

module.exports = {
  textQuery: async function (text, userID, parameters = {}){
    let sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID)
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

  eventQuery: async function (event, userID, parameters = {}){
    let sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID)
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