"use strict";

const _ = require('lodash');
const lexResponses = require('./lexResponses');

const departments = ['payroll', 'services delivery', 'benefits', 'operations', 'recruitment'];

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

let dialogManager = function (intentRequest) {
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
};


module.exports = dialogManager;