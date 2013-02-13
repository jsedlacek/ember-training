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

App.ApplicationRoute = Em.Route.extend({
    setupControllers: function() {
        // ember itemController bug workaround
        this.controllerFor('nowPlaying');
    }
});

App.IndexRoute = Em.Route.extend({
    model: function() {
        return App.Album.find();
    }
});
App.AlbumRoute = Em.Route.extend({
    events: {
        play: function(song) {
            debugger;
            this.controllerFor('nowPlaying').set('model', song.get('model'));
        }
    },

    model: function(params) {
        return App.Album.find(params.id);
    },

    serialize: function(album) {
      return { id: album.get('id') };
    }
});

App.SongController = Em.ObjectController.extend({
    needs: ['nowPlaying'],

    isSelected: function() {
        return this.get('controllers.nowPlaying.model') === this.get('model');
    }.property('controllers.nowPlaying.model', 'model'),

    // bug? itemController actions do not bubble to the routes?
    play: function(songController) {
        // need to peel the itemController by song.get('model')
        this.get('controllers.nowPlaying').set('model', songController.get('model'));
    },
    enqueue: function(songController) {
        // need to peel the itemController by song.get('model')
        this.get('controllers.nowPlaying').get('nextSongs').pushObject(songController.get('model'));
    }
});

App.NowPlayingController = Em.ObjectController.extend({
    displayQueue: false,
    nextSongs: null,

    init: function() {
        this.set('nextSongs', []);
    },

    // action called upon playing ended event as well as on 'next' button click
    next: function() {
        this.set('model', this.get('nextSongs').shiftObject());
    },

    // action called upon playing ended event as well as on 'next' button click
    showQueue: function() {
        this.set('displayQueue', !this.get('displayQueue'));
    }
});

App.AudioView = Em.View.extend({
    templateName: 'audioControl',
    classNames: ['audio-control'],

    // mirroring the audio tag properties
    currentTime: 0,
    duration: 0,
    isLoaded: false,
    isPlaying: false,
    displayRemaining: false,

    remainingTime: function() {
        return this.get('duration')-this.get('currentTime');
    }.property('duration', 'currentTime'),

    toggleTime: function() {
        this.set('displayRemaining', !this.get('displayRemaining'));
    },

    play: function() {
        this.$('audio')[0].play();
        this.set('isPlaying', true);
    },
    pause: function() {
        this.$('audio')[0].pause();
        this.set('isPlaying', false);
    },

    didInsertElement: function() {
        var view = this;
        var $range = this.$('input[type="range"]');
        var $audio = this.$('audio');

        $range.on('change', function() {
            $audio[0].currentTime = this.value;
        });

        $audio.on('durationchange', function(e) {
            view.set('duration', Math.floor(this.duration));
            console.log('duration', view.get('duration'));
        });
        $audio.on('loadedmetadata', function(e) {
            view.set('isLoaded', true);
            console.log('loaded', view.get('isLoaded'));
        });
        $audio.on('timeupdate', function(e) {
            view.set('currentTime', Math.floor(this.currentTime));
        });
        $audio.on('play', function(e) {
            view.set('isPlaying', true);
            console.log('playing', view.get('isPlaying'));
        });
        $audio.on('pause', function(e) {
            view.set('isPlaying', false);
            console.log('playing', view.get('isPlaying'));
        });
        $audio.on('ended', function(e) {
            view.get('controller').send('next');
            //view.set('ended', true);
            console.log('playing', view.get('isPlaying'));
        });
    }
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
