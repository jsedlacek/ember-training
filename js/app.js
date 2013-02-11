/*global App*/

"use strict";

window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource("album", { path: "/album/:album_id" });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Album.find();
  }
});

App.AlbumController = Ember.ObjectController.extend({
  needs: 'nowPlaying',
  totalDuration: function() {
    var total = 0;

    this.get('songs').forEach(function(song) {
      total += song.get('duration');
    });

    return total;
  }.property('songs.@each.duration'),

  play: function(song) {
    this.set('controllers.nowPlaying.content', song);
  }
});

App.NowPlayingController = Ember.ObjectController.extend();

Ember.Handlebars.registerBoundHelper('format-duration', function(seconds) {
  var formattedMinutes = Math.floor(seconds / 60);
  var formattedSeconds = seconds % 60;
  formattedSeconds = formattedSeconds < 10 ? "0" + formattedSeconds : formattedSeconds;
  return formattedMinutes + ":" + formattedSeconds;
});

var attr = DS.attr, hasMany = DS.hasMany, belongsTo = DS.belongsTo;

App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'DS.FixtureAdapter'
});

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
  album: 1
}, {
  id: 12,
  track: 2,
  name: "Hours",
  duration: 344,
  album: 1
}, {
  id: 13,
  track: 3,
  name: "Daydream",
  duration: 334,
  album: 1
}, {
  id: 14,
  track: 4,
  name: "Dive",
  duration: 499,
  album: 1
}];

App.AudioView = Ember.View.extend({
  templateName: 'audio-control',
  currentTime: 0,

  didInsertElement: function() {
    var view = this;

    this.$('audio').on('loadeddata', function(e) {
      Ember.run(this, function() {
        view.set('duration', this.duration);
        view.set('isLoaded', true);
      });
    });

    this.$('audio').on('timeupdate', function(e) {
      Ember.run(this, function() {
        view.set('currentTime', Math.floor(this.currentTime));
      });
    });
  },

  change: function() {
    this.$('audio').prop('currentTime', this.$('input').val());
  },

  playSong: function() {
    this.set('isPlaying', true);
    this.$('audio')[0].play();
  },

  pauseSong: function() {
    this.set('isPlaying', false);
    this.$('audio')[0].pause();
  }
});
