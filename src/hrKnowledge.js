"use strict";

const handleDialogCodeHook = require('./dialog-manager');
const handleFulfillmentCodeHook = require('./fulfillment-manager');

module.exports = function (intentRequest) {
  const source = intentRequest.invocationSource;

  if (source === 'DialogCodeHook') {
    return handleDialogCodeHook(intentRequest);
  }

  if (source === 'FulfillmentCodeHook') {
    return handleFulfillmentCodeHook(intentRequest);
  }
};