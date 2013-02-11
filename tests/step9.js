step(9, "Render Current Song");

test("currentSong template should have a footer element", function() {
  shouldHaveElement('footer.now-playing');
});

test("Should display a message if there is no currently selected song", function() {
  shouldHaveElement('.now-playing span.now-playing-empty', "Select a song to start playing.");
});

test("Should enclose the track number in a span with the class track-number", function() {
  click('.album:first a');

  shouldHaveElements('td.song-track span.track-number', 4);
  shouldHaveElements('td.song-track span.play', 4);
});

test("Clicking a song's play button shows it in the now playing template", function() {
  click('.album:first a');
  click('td.song-track:first .play');

  shouldHaveElement('.now-playing div.now-playing-body span.now-playing-name', "A Walk");
  shouldHaveElement('.now-playing div.now-playing-body span.now-playing-artist', "GOLDHOUSE");
});
