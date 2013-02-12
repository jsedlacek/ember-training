(function() {
"use strict";

window.App = Em.Application.create();

App.Store = DS.Store.extend({
    revision: 11,
    adapter: 'DS.FixtureAdapter'
});

App.Router.map(function() {
    this.resource('album', { path: '/album/:id' });
});

App.IndexRoute = Em.Route.extend({
    model: function() {
        return App.Album.find();
    }
});
App.AlbumRoute = Em.Route.extend({
    events: {
        play: function(song) {
            this.controllerFor('nowPlaying').set('model', song);
        }
    },

    model: function(params) {
        return App.Album.find(params.id);
    },

    serialize: function(album) {
      return { id: album.get('id') };
    }
});

App.NowPlayingController = Em.ObjectController.extend({
});

App.AlbumController = Em.ObjectController.extend({
    // can handle this on the controller... however this belongs to the route...
    Xneeds: ['nowPlaying'],
    Xplay: function(song) {
        this.get('controllers.nowPlaying').set('song', song);
    },

    totalDuration: function() {
        return (this.get('songs') || []).getEach('duration').reduce(function(s, t) {
            return s += t;
        }, 0);
    }.property('songs.@each.duration')
});

Ember.Handlebars.registerBoundHelper('format-duration', function(value, options) {
    var secs = ''+(value % 60);
    return ''+Math.floor(value / 60)+':'+(secs.length === 1 ? '0' : '')+secs;
});

var attr = DS.attr, belongsTo = DS.belongsTo, hasMany = DS.hasMany;

App.Album = DS.Model.extend({
  artwork: attr('string'),
  name: attr('string'),
  artist: attr('string'),
  songs: hasMany('App.Song'),
  isExplicit: attr('boolean')
});

App.Song = DS.Model.extend({
  track: attr('number'),
  name: attr('string'),
  duration: attr('number'),
  url: attr('string'),

  album: belongsTo('App.Album')
});

App.Album.FIXTURES = [{
  id: 1,
  artwork: "http://cdn3.rd.io/album/d/b/c/0000000000220cbd/1/square-200.jpg",
  name: "The Morning After",
  artist: "GOLDHOUSE",
  songs: [ 11, 12, 13, 14 ]
}, {
  id: 2,
  artwork: "http://cdn3.rd.io/album/0/1/3/0000000000279310/1/square-200.jpg",
  name: "Dusk to Dawn",
  artist: "Emancipator",
  songs: [ 21, 22, 23 ]
}, {
  id: 3,
  artwork: "http://cdn3.rd.io/album/d/d/5/00000000001e25dd/3/square-200.jpg",
  name: "The Heist",
  artist: "Macklemore & Ryan Lewis",
  isExplicit: true,
  songs: [ 31, 32, 33 ]
}, {
  id: 4,
  artwork: "http://cdn3.rd.io/album/f/0/b/0000000000152b0f/8/square-200.jpg",
  name: "Some Nights",
  artist: "fun.",
  isExplicit: true,
  songs: [ 41, 42, 43 ]
}];

App.Song.FIXTURES = [{
  id: 11,
  track: 1,
  name: "A Walk",
  duration: 316,
  url: 'audio/Southern_Nights_-_07_-_All_My_Sorrows.mp3',
  album: 1
}, {
  id: 12,
  track: 2,
  name: "Hours",
  duration: 344,
  url: 'audio/Southern_Nights_-_06_-_Um.mp3',
  album: 1
}, {
  id: 13,
  track: 3,
  name: "Daydream",
  duration: 334,
  url: 'audio/Southern_Nights_-_08_-_Go_Way.mp3',
  album: 1
}, {
  id: 14,
  track: 4,
  name: "Dive",
  duration: 499,
  url: 'audio/Southern_Nights_-_09_-_Grass_or_Gasoline.mp3',
  album: 1
}];

})();
