(function() {

step(2, "Add Artwork");

test("Each album should have an image with its src attribute bound to the model's artwork property", function() {
  // [src^=http] means that the 'src' attribute must begin with http
  shouldHaveElements('.album img[src^=http]', 4);
});

})();
