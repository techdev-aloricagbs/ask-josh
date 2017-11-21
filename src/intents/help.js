"use strict";

const handleFulfillmentCodeHook = require('../fulfillment-manager');

module.exports = function (intentRequest) {
  return handleFulfillmentCodeHook(intentRequest);
};