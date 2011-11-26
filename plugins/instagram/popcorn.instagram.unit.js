test( "Popcorn instagram Plugin", function() {

  var popped = Popcorn( "#video" ),
      expects = 8,
      count = 0,
      setupId,
      instagramdiv = document.getElementById( "instagramdiv" );

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  stop();
  ok( "instagram" in popped, "instagram is a method of the popped instance" );

  plus();

  equals( instagramdiv.innerHTML, "", "initially, there is nothing inside the instagramdiv" );
  plus();

  popped.instagram({
    start: 0,
    end: 15,
    username: "kaz_55",
    target: "instagramdiv",
    access_token: "12352090.f59def8.7f136890e8b94b5d9115f3fcc72d85fe"
    })
    .instagram({
    start: 15,
    end: 30,
    username: "audkawa",
    target: "instagramdiv",
    access_token: "12352090.f59def8.7f136890e8b94b5d9115f3fcc72d85fe"
    })
    .instagram({
    start: 30,
    end: 45,
    userid: "396",
    target: "instagramdiv",
    access_token: "12352090.f59def8.7f136890e8b94b5d9115f3fcc72d85fe"
    });

  setupId = popped.getLastTrackEventId();

  popped.exec( 3, function() {

    ok( /display: inline;/.test( instagramdiv.innerHTML ), "Div contents are displayed" );
    plus();
    ok( /img/.test( instagramdiv.innerHTML ), "An image exists" );
    plus();
    equals( instagramdiv.childElementCount, 3, "instagramdiv now has three inner elements" );
    plus();
  });

  popped.exec( 5, function() {

    ok( /display: inline;/.test( instagramdiv.innerHTML ), "Div contents are displayed" );
    plus();

    ok( /img/.test( instagramdiv.innerHTML ), "An image exists" );
    plus();

  });

  popped.exec( 8, function() {

    ok( /display: none;/.test( instagramdiv.innerHTML ), "Div contents are hidden again" );
    plus();

    popped.pause().removeTrackEvent( setupId );
    ok( !instagramdiv.children[ 2 ], "Removed instagram was properly destroyed"  );
    plus();
  });

  // empty track events should be safe
  popped.instagram({});

  // debug should log errors on empty track events
  Popcorn.plugin.debug = true;
  try {
    popped.instagram({});
  } catch( e ) {
    ok( true, "empty event was caught by debug" );
    plus();
  }

  popped.volume( 0 ).play();

});
