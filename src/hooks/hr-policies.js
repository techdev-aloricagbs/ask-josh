"use strict";

const utils = require('../utils');
const lexResponses = require('../lexResponses');
const builders = require('../response-builders');

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
    options = utils.getOptions('Choose a policy', levelOnePolicies);
    return builders.validationResult(false, 'policy', `Checking policies..`, options);
  } else if (policy && (levelOnePolicies.indexOf(policy.toLowerCase()) === -1)) {
    console.log('Policy not in level 1. Proceeding to level 2 check');
    if (levelTwoPolicies.indexOf(policy.toLowerCase()) === -1) {
      console.log('Policy not in level 2. Asking for level one choices.')
      console.log('Policy was invalid.');
      options = utils.getOptions('Choose a policy', levelOnePolicies);

      return builders.validationResult(false, 'policy', `Checking policies...`, options);
    } else {
      console.log('Policy in level 2. Checking..')
      return builders.validationResult(true, null, null);
    }
  } else {
    console.log('Policy in level 1, Asking for level 2.');
    options = utils.getOptions(`What specific policy under ${policy} do you wish to know?`, policies[policy]);

    return builders.validationResult(false, 'policy', `Checking policies...`, options);
  }

}

/**
 * Handles the HRPolicies intent
 * @param intentRequest
 * @returns {Promise.<{sessionAttributes, dialogAction}>}
 */
function handleDialogCodeHook(intentRequest) {
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

function handleFulfillmentCodeHook(intentRequest) {
  let policy = intentRequest.currentIntent.slots.policy;
  let policyLinkMap = {
    "corporate social responsibility": "https://engage.alorica.com/all-alorica/wp-content/uploads/sites/83/FINAL-Corporate-Social-Responsibility-Policy.pdf",
    "pre-employment requirements": "https://engage.alorica.com/philippines/wp-content/uploads/sites/206/Pre-Employment-Requirements-Policy.pdf",
    "social media": "https://engage.alorica.com/marketing/",
    "attendance": "https://engage.alorica.com/philippines/wp-content/uploads/sites/206/HR-Approved-Attendance-Policy.pdf",
    "employee development": "https://engage.alorica.com/philippines/wp-content/uploads/sites/206/HR-Employee-Development-Program_04012014.doc",
    'regularization process': "https://engage.alorica.com/philippines/wp-content/uploads/sites/206/HR-Regularization-Process.doc",
    'holiday substitution': 'https://engage.alorica.com/philippines/wp-content/uploads/sites/206/HR-2014-PHILIPPINE-HOLIDAY-SUBSTITUTION-MEMO.doc',
    'leave administration policy': 'https://engage.alorica.com/philippines/wp-content/uploads/sites/206/HR-LEAVE-ADMINISTRATION-POLICY.pdf',
    'movement policy': 'https://engage.alorica.com/philippines/wp-content/uploads/sites/206/Movement-Policy.pdf',
    'drugs': 'https://engage.alorica.com/philippines/wp-content/uploads/sites/206/Drug-Free-Policy.pdf',
    'infectious diseases': 'https://engage.alorica.com/philippines/human-resources/#',
  };

  let messageContent = `You can check out everything about ${policy} using this link: ${policyLinkMap[policy]}.`;
  let result = builders.fulfillmentResult('Fulfilled', messageContent);

  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, result.fulfillmentState, result.message))
}

const hrPoliciesHook = function(intentRequest) {
  const source = intentRequest.invocationSource;

  if (source === 'DialogCodeHook') {
    return handleDialogCodeHook(intentRequest);
  }

  if (source === 'FulfillmentCodeHook') {
    return handleFulfillmentCodeHook(intentRequest);
  }
};

module.exports = hrPoliciesHook;