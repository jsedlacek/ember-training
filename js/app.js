(function() {
"use strict";

window.App = Ember.Application.create();

App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'DS.FixtureAdapter'
});

App.Router.map(function() {
  this.route('album');
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Album.find();
  }
});

})();
