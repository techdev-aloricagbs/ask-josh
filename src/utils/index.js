"use strict";

const _ = require('lodash');

const getButtons = function(options) {
  let buttons = [];
  _.forEach(options, option => {
    buttons.push({
      text: _.startCase(option),
      value: option
    });
  });
  return buttons;
};

const getOptions = function (title, types) {
  return {
    title,
    imageUrl: null,//'https://cdn0.iconfinder.com/data/icons/life-insurance-4/64/1-15-512.png',
    buttons: getButtons(types)
  };
};


module.exports.getOptions = getOptions;
module.exports.getButtons = getButtons;

