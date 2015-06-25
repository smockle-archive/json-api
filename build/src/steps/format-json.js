"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dasherizeResource = dasherizeResource;
exports.dasherizeResourceOrCollection = dasherizeResourceOrCollection;
exports.camelizeResource = camelizeResource;
exports.camelizeResourceOrCollection = camelizeResourceOrCollection;

var _dasherize = require("dasherize");

var _dasherize2 = _interopRequireDefault(_dasherize);

var _utilCamelize = require("../util/camelize");

var _utilCamelize2 = _interopRequireDefault(_utilCamelize);

var _typesResource = require("../types/Resource");

var _typesResource2 = _interopRequireDefault(_typesResource);

var _typesCollection = require("../types/Collection");

var _typesCollection2 = _interopRequireDefault(_typesCollection);

function dasherizeResource(resource) {
  return transformResourceKeys(resource, _dasherize2["default"]);
}

function dasherizeResourceOrCollection(toDasherize, registry) {
  return transformResourceOrCollection(toDasherize, dasherizeResource, registry);
}

function camelizeResource(resource) {
  return transformResourceKeys(resource, _utilCamelize2["default"]);
}

function camelizeResourceOrCollection(toCamelize, registry) {
  return transformResourceOrCollection(toCamelize, camelizeResource, registry);
}

function transformResourceKeys(resource, transformFn) {
  for (var key in resource.attrs) {
    var transformedKey = transformFn(key);
    if (transformedKey !== key) {
      resource.attrs[transformedKey] = resource.attrs[key];
      delete resource.attrs[key];
    }
  }

  return resource;
}

function transformResourceOrCollection(toTransform, transformFn, registry) {
  if (toTransform instanceof _typesCollection2["default"]) {
    toTransform.resources = toTransform.resources.map(function (r) {
      if (registry.behaviors(r.type).dasherizeOutput.enabled) {
        return transformFn(r);
      }
      return r;
    });
    return toTransform;
  } else if (toTransform instanceof _typesResource2["default"]) {
    if (registry.behaviors(toTransform.type).dasherizeOutput.enabled) {
      return transformFn(toTransform);
    }
  }

  throw new TypeError("Input must be a Resource or a Collection");
}