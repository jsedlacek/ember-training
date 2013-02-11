step(8, "Total Duration");

function makeSong(options) {
  return Ember.Object.create(options);
}

test("The AlbumController correctly calculates totalDuration", function() {
  var controller = createController('album');

  var songs = [
    makeSong({ duration: 10 }),
    makeSong({ duration: 120 }),
    makeSong({ duration: 234 })
  ];

  controller.set('model', { songs: songs });
  equal(controller.get('totalDuration'), 364, "total duration is the sum of the songs' durations");

  songs.pushObject(makeSong({
    duration: 25
  }));
  equal(controller.get('totalDuration'), 389, "total duration is updated when a new song is added");

  songs[0].set('duration', 20);
  equal(controller.get('totalDuration'), 399, "total duration is updated when a song's duration is changed");

  songs.popObject();
  equal(controller.get('totalDuration'), 374, "total duration is updated when a song is removed");
});

test("The total duration is displayed", function() {
  click('.album:first a');

  shouldHaveElement('.album-listing .total-duration', "24:53");
});
