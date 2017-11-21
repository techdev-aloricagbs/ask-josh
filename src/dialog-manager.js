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
  // 'regularization process',
  // 'holiday substitution',
  // 'leave administration policy',
  // 'movement policy',
  // 'drugs',
  // 'infectious diseases',
];

function buildValidationResult(isValid, violatedSlot, messageContent, options) {
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
}

function getButtons(options) {
  var buttons = [];
  _.forEach(options, option => {
    buttons.push({
      text: option,
      value: option
    });
  });
  return buttons;
}

function getOptions(title, types) {
  return {
    title,
    imageUrl: 'https://cdn0.iconfinder.com/data/icons/life-insurance-4/64/1-15-512.png',
    buttons: getButtons(types)
  };
}

function validateDepartment(department) {
  if (!deparyment || (department && (departments.indexOf(department.toLowerCase()) === -1))) {
    const options = getOptions('Select a department', departments);
    return buildValidationResult(false, 'department', `We do not have that department for Human Resource.`, options);
  }

  return buildValidationResult(true, null, null);
}

function validatePolicy(policy) {
  console.log('Validating policy input: ' + policy);
  if (!policy || (policy && (policies.indexOf(policy.toLowerCase()) === -1))) {
    console.log('Policy was invalid.');
    const options = getOptions('Choose a policy', policies);

    return buildValidationResult(false, 'policy', `We do not have any information about ${policy} policy.`, options);
  }
  console.log('Policy was valid.');
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
        validationResult.message,
        validationResult.options.title,
        validationResult.options.imageUrl,
        validationResult.options.buttons
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
        validationResult.message,
        validationResult.options.title,
        validationResult.options.imageUrl,
        validationResult.options.buttons
      )
    );
  }

  return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
}

let dialogManager = function (intentRequest) {
  const intentName = intentRequest.currentIntent.name;

  if (intentName === 'HRKnowledge') {
    console.log(`Processing ${intentName} dialog..`);
    return executeHrKnowledge(intentRequest);
  }

  if (intentName === 'HRPolicies') {
    console.log(`Processing ${intentName} dialog..`);
    return executePolicies(intentRequest);
  }

};


module.exports = dialogManager;