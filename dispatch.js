'use strict';

const hrKnowledge = require('./src/intents/hr-knowledge/hrKnowledge');
const policies = require('./src/intents/hr-policies/policies');
const help = require('./src/intents/help');
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

  throw new Error(`Intent with name ${intentName} not supported`);
};