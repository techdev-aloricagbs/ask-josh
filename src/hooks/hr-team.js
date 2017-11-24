"use strict";

const utils = require('../utils');
const lexResponses = require('../lexResponses');
const builders = require('../response-builders');
const Table = require('cli-table2');
const constants = require('../constants');
const _ = require('lodash');

const table = new Table({
  chars: {
    'top': '-',
    'top-mid': '-',
    'top-left': '-',
    'top-right': '-',
    'bottom': '-',
    'bottom-mid': '-',
    'bottom-left': '-',
    'bottom-right': '-',
    'left': '||',
    'left-mid': '-' ,
    'mid': '-' ,
    'mid-mid': '-',
    'right': '||',
    'right-mid': '-',
    'middle': '||'
  },
  head: ['Name', 'Title', `Site`, 'Email Address'],
});

const departments = ['payroll', 'services delivery', 'benefits', 'operations', 'recruitment'];

function validateDepartment(department) {
  if (!department || (department && (departments.indexOf(department.toLowerCase()) === -1))) {
    const options = utils.getOptions('Choose a department', departments);
    return builders.validationResult(false, 'department', `You can checkout our Philippines team at this link: https://engage.alorica.com/philippines/human-resources/`, options);
  }
  return builders.validationResult(true, null, null);
}

function handleDialogCodeHook(intentRequest) {
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

function handleFulfillmentCodeHook(intentRequest) {
  _.forEach(constants.TEAMS.operations, member => {
    table.push(member);
  });
  
  // console.log(table.toString());
  let result = builders.fulfillmentResult('Fulfilled', table.toString());
  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, result.fulfillmentState, result.message));
}

const hrTeamHook = function (intentRequest) {
  const source = intentRequest.invocationSource;

  if (source === 'DialogCodeHook') {
    return handleDialogCodeHook(intentRequest);
  }

  if (source === 'FulfillmentCodeHook') {
    return handleFulfillmentCodeHook(intentRequest);
  }
};

module.exports = hrTeamHook;
