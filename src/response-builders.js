"use strict";

module.exports.validationResult = function(isValid, violatedSlot, messageContent, options) {
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot,
      options
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent },
    options
  };
};

module.exports.fulfillmentResult = function(fulfillmentState, messageContent) {
  return {
    fulfillmentState: fulfillmentState,
    message: { contentType: 'PlainText', content: messageContent }
  };
};