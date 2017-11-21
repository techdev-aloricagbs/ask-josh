"use strict";

const _ = require('lodash');
const lexResponses = require('./lexResponses');

const departments = ['payroll', 'services delivery', 'benefits', 'operations', 'recruitment'];
const policies = [
  'corporate social responsibility',
  'pre-employment requirements',
  'social media',
  'attendance',
  'employee development',
];

function buildValidationResult(isValid, violatedSlot, messageContent) {
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent }
  };
}

function validateDepartment(department) {
  if (department && (departments.indexOf(department.toLowerCase()) === -1)) {
    return buildValidationResult(false, 'department', `We do not have that department for Human Resource.`);
  }

  return buildValidationResult(true, null, null);
}

function validatePolicy(policy) {
  if (policy && (policies.indexOf(policy.toLowerCase()) === -1)) {
    return buildValidationResult(false, 'policy', `We do not have any information about ${policy} policy.`);
  }

  return buildValidationResult(true, null, null);
}

/**
 * Handles the HrKnowledge IntentDialog
 * @param intentRequest
 * @returns {Promise.<{sessionAttributes, dialogAction}>}
 */
function executeHrKnowledge(intentRequest) {
  const slots = intentRequest.currentIntent.slots;
  let department = intentRequest.currentIntent.slots.department;

  const validationResult = validateDepartment(department);

  if (!validationResult.isValid) {
    slots[`${validationResult.violatedSlot}`] = null;
    return Promise.resolve(
      lexResponses.elicitSlot(
        intentRequest.sessionAttributes,
        intentRequest.currentIntent.name,
        slots,
        validationResult.violatedSlot,
        validationResult.message
      )
    );
  }

  return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
}

/**
 * Handles the HRPolicies intent
 * @param intentRequest
 * @returns {Promise.<{sessionAttributes, dialogAction}>}
 */
function executePolicies(intentRequest) {
  const slots = intentRequest.currentIntent.slots;

  let policy = intentRequest.currentIntent.slots.policy;
  const validationResult = validatePolicy(policy);

  if (!validationResult.isValid) {
    slots[`${validationResult.violatedSlot}`] = null;
    return Promise.resolve(
      lexResponses.elicitSlot(
        intentRequest.sessionAttributes,
        intentRequest.currentIntent.name,
        slots,
        validationResult.violatedSlot,
        validationResult.message
      )
    );
  }

  return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
}

let dialogManager = function (intentRequest) {
  const intentName = intentRequest.currentIntent.name;

  if (intentName === 'HRKnowledge') {
    console.log(`${intentName} was called`);
    return executeHrKnowledge(intentRequest);
  }

  if (intentName === 'HRPolicies') {
    console.log(`${intentName} was called.`);
    return executePolicies(intentRequest);
  }

};


module.exports = dialogManager;