'use strict';

const requestHookRouter = require('./src/request-hook-router');
const lexResponses = require('./src/lexResponses');

const supportedIntents = [
  "HRPolicies", "HRHelp", "HRTeam"
];

module.exports = function(intentRequest) {
  const intentName = intentRequest.currentIntent.name;

  if (supportedIntents.indexOf(intentName) !== -1) {
    console.log(`${intentName} was called`);
    return requestHookRouter(intentRequest);
  }

  let message = {
    contentType: 'PlainText',
    content: `I cannot process your query - ${intentRequest.inputTranscript} - I am still learning.`,
  };
  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', message));
};