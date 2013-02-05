/*global App*/

"use strict";

window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource("album", { path: "/album" });
});
