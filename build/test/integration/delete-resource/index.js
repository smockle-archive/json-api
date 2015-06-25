"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _chai = require("chai");

var _appAgent = require("../../app/agent");

var _appAgent2 = _interopRequireDefault(_appAgent);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

describe("Deleting a resource", function () {

  var id = undefined;
  before(function (done) {
    _appAgent2["default"].then(function (Agent) {
      _mongoose2["default"].models.Organization.create({ name: "Delete me" }, function (err, model) {
        if (err) {
          done(err);
        }
        id = model._id;
        Agent.request("DEL", "/organizations/" + id).type("application/vnd.api+json").send().promise().then(function () {
          return done();
        }, done)["catch"](done);
      });
    });
  });

  it("should delete a resource by id", function (done) {
    _mongoose2["default"].models.Organization.findById(id, function (err, model) {
      (0, _chai.expect)(err).to.be["null"];
      (0, _chai.expect)(model).to.be["null"];
      done();
    });
  });
});