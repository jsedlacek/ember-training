(function() {
"use strict";

window.App = Em.Application.create();

//App.store = DS.Store.create({
//    revision: 11,
//    adapter: 'DS.FixtureAdapter'
//});
//
App.Router.map(function() {
    this.route('album');
});

})();
