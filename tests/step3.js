(function() {

step(3, "Add Resource");

test("When navigating to /album/1, the album with ID of 1 is displayed", function() {
  navigateTo('/album/1', function() {
    shouldHaveElement('.album-info');
  });
});

})();
