/*
  In Step 2, use the {{bindAttr}} helper to display the album artwork
  for each album.
*/

step(2, "Add Artwork");

test("Each album should have an image with its src attribute bound to the model's artwork property", function() {
  // [src^=http] means that the 'src' attribute must begin with http
  shouldHaveElements('.album img[src^=http]', 4);

  var images = [
    "http://cdn3.rd.io/album/d/b/c/0000000000220cbd/1/square-200.jpg",
    "http://cdn3.rd.io/album/0/1/3/0000000000279310/1/square-200.jpg",
    "http://cdn3.rd.io/album/0/1/3/0000000000279310/1/square-200.jpg",
    "http://cdn3.rd.io/album/f/0/b/0000000000152b0f/8/square-200.jpg"
  ];

  images.forEach(function(image) {
    shouldHaveElement('.album img', { src: image }, "Image should have src bound to " + image);
  });
});
