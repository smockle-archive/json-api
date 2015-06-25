"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _chai = require("chai");

var _srcResourceTypeRegistry = require("../../../../src/ResourceTypeRegistry");

var _srcResourceTypeRegistry2 = _interopRequireDefault(_srcResourceTypeRegistry);

var _srcStepsDoQueryDoGet = require("../../../../src/steps/do-query/do-get");

var _srcStepsDoQueryDoGet2 = _interopRequireDefault(_srcStepsDoQueryDoGet);

var TestAdapter = (function () {
  function TestAdapter() {
    _classCallCheck(this, TestAdapter);
  }

  _createClass(TestAdapter, [{
    key: "find",
    value: function find(type, idOrIds, fields, sorts, filters, includes) {
      return {
        then: function then() {
          return { type: type, idOrIds: idOrIds, fields: fields, sorts: sorts, filters: filters, includes: includes };
        }
      };
    }
  }], [{
    key: "getReferencedType",
    value: function getReferencedType(model, path) {
      if (path === "some-relationship") {
        return "dasherize-off-type";
      }
      return "dasherize-on-type";
    }
  }]);

  return TestAdapter;
})();

describe("GET requests", function () {

  var registry = undefined;
  var dbAdapter = new TestAdapter();

  before(function () {
    registry = new _srcResourceTypeRegistry2["default"]();
    registry.type("dasherize-on-type", { dbAdapter: dbAdapter });
    registry.type("dasherize-off-type", {
      dbAdapter: dbAdapter,
      behaviors: {
        dasherizeOutput: { enabled: false }
      }
    });
  });

  describe("parsing query params", function () {
    it("should camelize fields param according to type behavior", function () {
      var request = {
        type: "dasherize-on-type",
        queryParams: {
          fields: {
            "dasherize-on-type": "a-dasherized-field",
            "dasherize-off-type": "another-dasherized-field"
          }
        }
      };

      var passedToAdapter = (0, _srcStepsDoQueryDoGet2["default"])(request, {}, registry);
      (0, _chai.expect)(passedToAdapter.fields).to.deep.equal({
        "dasherize-on-type": ["aDasherizedField"],
        "dasherize-off-type": ["another-dasherized-field"]
      });
    });

    it("should camelize sort param according to type behavior", function () {
      var request = {
        type: "dasherize-on-type",
        queryParams: {
          sort: "ascending-field,-descending-field"
        }
      };

      var passedToAdapter = (0, _srcStepsDoQueryDoGet2["default"])(request, {}, registry);
      (0, _chai.expect)(passedToAdapter.sorts).to.deep.equal(["ascendingField", "-descendingField"]);
    });

    it("should camelize dot-separated sort path according to type behavior", function () {
      var request = {
        type: "dasherize-on-type",
        queryParams: {
          sort: "some-relationship.dont-transform-this-one"
        }
      };

      var passedToAdapter = (0, _srcStepsDoQueryDoGet2["default"])(request, {}, registry);
      (0, _chai.expect)(passedToAdapter.sorts).to.deep.equal(["someRelationship.dont-transform-this-one"]);
    });

    it("should camelize include param according to type behavior", function () {
      var request = {
        type: "dasherize-on-type",
        queryParams: {
          include: "dasherized-path.to-include,another-path"
        }
      };

      var passedToAdapter = (0, _srcStepsDoQueryDoGet2["default"])(request, {}, registry);
      (0, _chai.expect)(passedToAdapter.includes).to.deep.equal(["dasherizedPath.toInclude", "anotherPath"]);
    });

    it("should camelize filter param according to type behavior", function () {
      var request = {
        type: "dasherize-on-type",
        queryParams: {
          filter: {
            simple: {
              "dasherized-attribute": "equalsThisValue"
            }
          }
        }
      };

      var passedToAdapter = (0, _srcStepsDoQueryDoGet2["default"])(request, {}, registry);
      (0, _chai.expect)(passedToAdapter.filters).to.deep.equal({ dasherizedAttribute: "equalsThisValue" });
    });
  });
});