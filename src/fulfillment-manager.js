"use strict";

const lexResponses = require('./lexResponses');

function buildFulfilmentResult(fulfillmentState, messageContent) {
  return {
    fulfillmentState: fulfillmentState,
    message: { contentType: 'PlainText', content: messageContent }
  };
}

function fulfillOrder(department) {
  return buildFulfilmentResult('Fulfilled', `The information about ${department} is still being built by Human Resource.`);
}

module.exports = function(intentRequest) {
  let result = fulfillOrder(intentRequest.currentIntent.slots.department);

  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, result.fulfillmentState, result.message))
};