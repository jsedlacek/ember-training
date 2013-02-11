/*
  In Step 1, you are going to load some models from fixture data in the
  router.

  Then, you'll use the {{#each}} helper that you learned about to print
  each of the albums using a template.

  First, make sure you've defined an App.Store in your app.js file:

      App.Store = DS.Store.extend({
        revision: 11,
        adapter: 'DS.FixtureAdapter'
      });

  After that, include the models we've provided, as well as some fixture
  data, by adding a script tag to your HTML:

      <script src="js/models.js"></script>

  Next, create a route handler for the index template, and make sure
  you set its model to the list of albums.

  Finally, delete all but one of the static albums in the index template.
  Use the {{#each}} helper to re-use the remaining HTML once per album
  in the application. Use Handlebars properties like {{name}} to use the
  values on the model instead of hard-coding.

  Note: to get started, remove the {{#linkTo}} helper around the album
  artwork. We'll add it back in a later step.
*/

step(1, "List Albums");

test("The Application has a store defined", function() {
  ok(App.Store, "App.Store is defined");
});

test("The models and fixture data have been loaded", function() {
  ok(App.Album, "The Album model is loaded");
  ok(App.Song, "The Song model is loaded");
  ok(App.Album.FIXTURES, "The Album fixture data has loaded");
  ok(App.Song.FIXTURES, "The Song fixture data has loaded");
});

test("Clicking on the BümBöx logo navigates back to the front page", function() {
  click('.album:first a');

  click('header a');

  urlEquals('/');
});

test("The album list is enclosed in a <div> with the class 'album-list'", function() {
  shouldHaveElement('div.album-list', "The album list is a <div class='album-list'>");
});

test("Each of the four albums should appear on the screen", function() {
  shouldHaveElements('.album-list .album', 4, "There should be four albums in the list");

  [ 'The Morning After', 'Dusk to Dawn', 'The Heist', 'Some Nights' ].forEach(function(name) {
    shouldHaveElement('.album p.album-name', name, "There should be an album whose album name is " + name);
  });

  [ 'GOLDHOUSE', 'Emancipator', 'Macklemore & Ryan Lewis', 'fun.' ].forEach(function(name) {
    shouldHaveElement('.album p.album-artist', name, "There should be an album whose artist name is " + name);
  });
});
