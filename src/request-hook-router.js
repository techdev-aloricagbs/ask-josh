"use strict";

const hrPoliciesHook = require('./hooks/hr-policies');
const hrTeamHook = require('./hooks/hr-team');
const hrHelpHook = require('./hooks/hr-help');

module.exports = function (intentRequest) {
  console.log(`Processing ${intentRequest.currentIntent.name}..`);

  if (intentRequest.currentIntent.name === "HRTeam") {
    return hrTeamHook(intentRequest);
  }

  if (intentRequest.currentIntent.name === "HRPolicies") {
    return hrPoliciesHook(intentRequest);
  }

  if (intentRequest.currentIntent.name === "HRHelp") {
    return hrHelpHook(intentRequest);
  }
};