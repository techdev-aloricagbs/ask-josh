'use strict';

const hrKnowledge = require('./src/intents/hr-knowledge/hrKnowledge');
const policies = require('./src/intents/hr-policies/policies');
const help = require('./src/intents/help');
const lexResponses = require('./src/lexResponses');

module.exports = function(intentRequest) {
  console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  const intentName = intentRequest.currentIntent.name;

  if (intentName === 'HRKnowledge') {
    console.log(`${intentName} was called`);
    return hrKnowledge(intentRequest);
  }

  if (intentName === 'HRPolicies') {
    console.log(`${intentName} was called.`);
    return policies(intentRequest);
  }

  if (intentName === 'HRHelp') {
    return help(intentRequest);
  }

  let message = {
    contentType: 'PlainText',
    content: `I cannot process your query - ${intentRequest.inputTranscript} - I am still learning.`,
  };
  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', message));
};