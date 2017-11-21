"use strict";

const _ = require('lodash');
const lexResponses = require('./lexResponses');

const departments = ['payroll', 'services delivery', 'benefits', 'operations', 'recruitment'];

const policies = {
  'code of conduct': [
    'corporate social responsibility',
    'pre-employment requirements',
    'social media',
    'attendance',
    'employee development',
  ],
  'compensation and benefits': [
    'regularization process',
    'holiday substitution',
    'leave administration policy',
    'movement policy',
  ],
  'health and safety': [
    'drugs',
    'infectious diseases'
  ]
};

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
  if (!department || (department && (departments.indexOf(department.toLowerCase()) === -1))) {
    const options = getOptions('Select a department', departments);
    return buildValidationResult(false, 'department', `We do not have that department for Human Resource.`, options);
  }

  return buildValidationResult(true, null, null);
}

/**
 * Validates the HR policy being requested
 * @param policy
 * @returns {{isValid, violatedSlot, options}|{isValid, violatedSlot, message, options}}
 */
function validatePolicy(policy) {
  console.log('Validating policy input: ' + policy);
  let levelOnePolicies = Object.keys(policies);
  let levelTwoPolicies = [];
  let options = {};
  levelOnePolicies.forEach(function(v) {
    levelTwoPolicies = levelTwoPolicies.concat(policies[v]);
  });

  if (!policy) {
    options = getOptions('Choose a policy', levelOnePolicies);
    return buildValidationResult(false, 'policy', `Checking policies..`, options);
  } else if (policy && (levelOnePolicies.indexOf(policy.toLowerCase()) === -1)) {
      console.log('Policy not in level 1. Proceeding to level 2 check');
      if (levelTwoPolicies.indexOf(policy.toLowerCase()) === -1) {
        console.log('Policy not in level 2. Asking for level one choices.')
        console.log('Policy was invalid.');
        options = getOptions('Choose a policy', levelOnePolicies);

        return buildValidationResult(false, 'policy', `Checking policies...`, options);
      } else {
        console.log('Policy in level 2. Checking..')
        return buildValidationResult(true, null, null);
      }
  } else {
    console.log('Policy in level 1, Asking for level 2.');
    options = getOptions(`What specific policy under ${policy} do you wish to know?`, policies[policy]);

    return buildValidationResult(false, 'policy', `Checking policies...`, options);
  }

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