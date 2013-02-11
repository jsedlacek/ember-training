step(6, "Songs List");

test("Information about the album is displayed", function() {
  click('.album:first a');

  shouldHaveElement('.album-info img', { src: 'http://cdn3.rd.io/album/d/b/c/0000000000220cbd/1/square-200.jpg' });
  shouldHaveElement('.album-info h1', "The Morning After");
  shouldHaveElement('.album-info h2', "GOLDHOUSE");
});

test("It should have a list of songs", function() {
  click('.album:first a');

  ["1", "2", "3", "4"].forEach(function(track, row) {
    shouldHaveElement('.album-listing td.song-track', track, "The track number '" + track + "' should be displayed in the first cell in row " + (row + 1));
  });

  ["A Walk", "Hours", "Daydream", "Dive"].forEach(function(song, row) {
    shouldHaveElement('.album-listing td.song-name', song, "The song name '" + song + "' should be displayed in the second cell in row " + (row + 1));
  });

  shouldHaveElements('.album-listing td.song-duration', 4, "The duration information for four tracks should be displayed in the last cell");
});
