"use strict";

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _chai = require("chai");

var _srcStepsFormatJson = require("../../../src/steps/format-json");

var formatters = _interopRequireWildcard(_srcStepsFormatJson);

var _srcTypesResource = require("../../../src/types/Resource");

var _srcTypesResource2 = _interopRequireDefault(_srcTypesResource);

var _srcTypesCollection = require("../../../src/types/Collection");

var _srcTypesCollection2 = _interopRequireDefault(_srcTypesCollection);

var _srcResourceTypeRegistry = require("../../../src/ResourceTypeRegistry");

var _srcResourceTypeRegistry2 = _interopRequireDefault(_srcResourceTypeRegistry);

describe("Format JSON (dasherize/camelize)", function () {

  var registry = undefined;
  before(function () {
    registry = new _srcResourceTypeRegistry2["default"]();
    registry.type("people", {});
  });

  describe("dasherizeResourceOrCollection", function () {
    var resource = undefined;
    before(function () {
      resource = new _srcTypesResource2["default"]("people", 1, {
        name: "Joe",
        nameOfDog: "Max"
      });
    });

    it("should dasherize attributes of a resource", function () {
      var dasherized = formatters.dasherizeResourceOrCollection(resource, registry);
      (0, _chai.expect)(dasherized.attrs).to.have.property("name-of-dog");
    });

    it("should dasherize attributes of each resource in a collection", function () {
      var collection = new _srcTypesCollection2["default"]([resource]);
      var dasherized = formatters.dasherizeResourceOrCollection(collection, registry);
      (0, _chai.expect)(dasherized.resources[0].attrs).to.have.property("name-of-dog");
    });
  });

  describe("camelizeResourceOrCollection", function () {
    var resource = undefined;
    before(function () {
      resource = new _srcTypesResource2["default"]("people", 2, {
        "name": "Joe",
        "name-of-dog": "Max"
      });
    });

    it("should camelize attributes of a resource", function () {
      var camelized = formatters.camelizeResourceOrCollection(resource, registry);
      (0, _chai.expect)(camelized.attrs).to.have.property("nameOfDog");
    });

    it("should camelize attributes of each resource in a collection", function () {
      var collection = new _srcTypesCollection2["default"]([resource]);
      var camelized = formatters.camelizeResourceOrCollection(collection, registry);
      (0, _chai.expect)(camelized.resources[0].attrs).to.have.property("nameOfDog");
    });
  });
});