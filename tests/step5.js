(function() {

step(5, "Add a Link");

test("Each album on the index page should have a link to the album page", function() {
  [ 1, 2, 3, 4 ].forEach(function(id) {
    shouldHaveElement('.album a', { href: '#/album/' + id });
  });
});

test("Clicking on an album shows the album template", function() {
  click('.album:first a');

  shouldHaveElement('.album-info');
});

})();

