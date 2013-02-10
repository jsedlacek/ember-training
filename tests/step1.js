/*globals App QUnit*/
(function() {

step(1, "List Albums");

test("Clicking on the BümBöx logo navigates back to the front page", function() {
  click('.album:first a');

  click('header a');

  urlEquals('/');
});

test("The album list is enclosed in a <div> with the class 'album-list'", function() {
  shouldHaveElement('div.album-list');
});

test("Each of the four albums should appear on the screen", function() {
  // Each album should be enclosed in the <div> with the class 'album-list'
  shouldHaveElements('.album-list .album', 4);

  [ 'The Morning After', 'Dusk to Dawn', 'The Heist', 'Some Nights' ].forEach(function(name) {
    shouldHaveElement('.album p.album-name', name);
  });

  [ 'GOLDHOUSE', 'Emancipator', 'Macklemore & Ryan Lewis', 'fun.' ].forEach(function(name) {
    shouldHaveElement('.album p.artist-name', name);
  });
});

})();
