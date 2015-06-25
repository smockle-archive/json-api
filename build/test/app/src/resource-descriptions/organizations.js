"use strict";

module.exports = {
  urlTemplates: {
    "self": "http://127.0.0.1:3000/organizations/{id}",
    "relationship": "http://127.0.0.1:3000/organizations/{ownerId}/links/{path}"
  },
  beforeSave: function beforeSave(resource) {
    resource.attrs.description = "Added a description in beforeSave";
    return resource;
  }
};