(function() {
"use strict";

window.App = Ember.Application.create();

App.IndexController = Ember.ArrayController.extend();

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
  name: "Own.it",
  duration: 316,
  url: 'audio/12 Own It 1',
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

App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return App.Album.find();
    }
});
App.Router.map(function() {
    this.resource('album', {path: '/albums/:album_id'});
});

App.AlbumRoute = Ember.Route.extend({
    model: function(params) {
        return App.Album.find(params.album_id);
    }
});
App.AlbumController = Ember.ObjectController.extend({
    needs: ['nowPlaying'],
    play: function(song) {
        this.get('controllers.nowPlaying').set('model', song);
    },
    queue: function(song) {
        this.get('controllers.nowPlaying.nextSongs').pushObject(song);
    },
    totalDuration: function() {
        var songs = this.get('songs');
        var duration = 0;
        songs.forEach(function(song) {
            duration += song.get('duration');
        });
        return duration;
    }.property('songs.@each.duration')
});

App.NowPlayingController = Ember.ObjectController.extend({
    displayQueue: false,
    showQueue: function() {
        this.set('displayQueue', !this.get('displayQueue'));
    },
    nextSongs: [],
    next: function() {
        var song = this.get('nextSongs').shiftObject();
        this.set('model', song);
    },
    play: function(song) {
        var nextSongs = this.get('nextSongs');
        nextSongs.removeAt(nextSongs.indexOf(song));
        this.set('model', song);
    }
});

Ember.Handlebars.registerBoundHelper('format-duration', function(value) {
    var seconds = Math.floor(value % 60);
    return Math.floor(value / 60) + ":" + (seconds > 9 ? seconds : '0' + seconds);
});

App.AudioView = Ember.View.extend({
    templateName: 'audioControl',
    classNames: ['audio-control'],
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    displayRemaining: false,
    remainingTime: function() {
        var currentTime = this.get('currentTime');
        var duration = this.get('duration');
        return duration - currentTime;
    }.property('currentTime', 'duration'),
    showRemainingTime: function() {
        this.set('displayRemaining', true);
    },
    showCurrentTime: function() {
        this.set('displayRemaining', false);
    },
    play: function() {
        this.set('isPlaying', true);
    },
    pause: function() {
        this.set('isPlaying', false);
    },
    didInsertElement: function() {
        var view = this;
        var $audio = this.$('audio');
        var $range = this.$('input[type=range]');
        $audio.on('loadeddata', function() {
            view.set('duration', this.duration);
        });
        $audio.on('timeupdate', function() {
            view.set('currentTime', this.currentTime);
        });
        $audio.on('play', function() {
            view.set('isPlaying', true);
        });
        $audio.on('pause', function() {
            view.set('isPlaying', false);
        });
        $audio.on('ended', function() {
            // view.set('isPlaying', false);
            view.get('controller').send('next');
        });
        $range.on('change', function() {
            $audio[0].currentTime = this.value;
        });
    },
    isPlayingDidChange: function() {
        var isPlaying = this.get('isPlaying');
        var $audio = this.$('audio');
        if (isPlaying) {
            $audio[0].play();
        }
        else {
            $audio[0].pause();
        }
    }.observes('isPlaying')
});

App.SongController = Ember.ObjectController.extend({
    needs: ['nowPlaying'],
    isPlaying: function() {
        var playingSong = this.get('controllers.nowPlaying.model');
        var song = this.get('model');
        return song === playingSong;
    }.property('controllers.nowPlaying.model')
});

})();
