'use strict';

const hrKnowledge = require('./src/hrKnowledge');

module.exports = function(intentRequest) {
  console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
  const intentName = intentRequest.currentIntent.name;

  if (intentName === 'HRKnowledge') {
    console.log(`${intentName} was called`);
    return hrKnowledge(intentRequest);
  }


  throw new Error(`Intent with name ${intentName} not supported`);
};