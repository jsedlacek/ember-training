/*
  In Step 4, you'll create a route with a dynamic segment so that
  you can link to each of the albums in your album list.

  Go to the router in your app.js file. You'll need to change the
  old route to a resource (because it represents a model). Then,
  you'll need to add a path that includes a dynamic segment.

  The test will try to manually go to `/album/1` and check to
  make sure that the album template is rendered.
*/
step(4, "Add Resource");

test("When navigating to /album/1, the album with ID of 1 is displayed", function() {
  navigateTo('/album/1', function() {
    shouldHaveElement('.album-info');
  });
});
