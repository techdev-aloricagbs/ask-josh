"use strict";

const lexResponses = require('./lexResponses');

function buildFulfilmentResult(fulfillmentState, messageContent) {
  return {
    fulfillmentState: fulfillmentState,
    message: { contentType: 'PlainText', content: messageContent }
  };
}

function fulfillHRKnowledge(department) {
  return buildFulfilmentResult('Fulfilled', `The information about ${department} is still being built by Human Resource.`);
}

function fulfillHRPolicies(policy) {
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

  return buildFulfilmentResult('Fulfilled', messageContent);
}

module.exports = function(intentRequest) {
  const intentName = intentRequest.currentIntent.name;
  let result;

  if (intentName === 'HRKnowledge') {
    result = fulfillHRKnowledge(intentRequest.currentIntent.slots.department);
  }

  if (intentName === 'HRPolicies') {
    result = fulfillHRPolicies(intentRequest.currentIntent.slots.policy);
  }

  return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, result.fulfillmentState, result.message))

};