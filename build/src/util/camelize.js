"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (str) {
  return str.replace(/(?!^)[-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
};

module.exports = exports["default"];