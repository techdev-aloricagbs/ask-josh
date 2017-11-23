"use strict";

const lexResponses = require('../lexResponses');
const builders = require('../response-builders');

module.exports = function(intentRequest) {
  let result = builders.fulfillmentResult('Fulfilled', "I am here to help you with anything HR related.");

  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, result.fulfillmentState, result.message))
};