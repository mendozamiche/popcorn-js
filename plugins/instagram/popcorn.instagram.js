// PLUGIN: Instagram
(function ( Popcorn ) {
  /**
   * Instagram popcorn plugin
   * Appends a user's instagram images to an element on the page
   * Options parameter requires a start, end, target, username or userid, and access token
   * Start: the time of the video at which the plugin will execute ( in seconds)
   * End: the time of the video at which the plugin will stop executing ( in seconds)
   * Username/userid: username or user id of the user whose images will be shown
   *  - either username or userid is required
   * Target: id of the document element that the image will be appended to ( must exist on the DOM)
   * access_token: Access token provided by the Instagram API

   * @param {Object} options

   * Example:
       var p = Popcorn('#video')
         .instagram({
           start:          5,                    // seconds, mandatory
           end:            15,                   // seconds, mandatory
           username:       'michellexx',         // mandatory/optional (use either username or userid)
           userid:         '123',                // optional (use either username or userid)
           target:         'instagramdiv',       // mandatory
           access_token:   '1234567890abcdef'    // mandatory
         } )
   *
   */
  var htmlString = "";
  var idx = 0;

  Popcorn.plugin( "instagram", function( options ){
    var access_token = options.access_token;
    var containerDiv,
      target = document.getElementById( options.target ),
      _userid,
      _uri;

    // create a new div this way anything in the target div is left intact
    // this is later populated with instagram images
    containerDiv = document.createElement( "div" );
    containerDiv.id = "instagram" + idx;

    var containerStyle = containerDiv.style;
    containerStyle.width = "100%";
    containerStyle.height = "100%";
    containerStyle.display = "none";
    idx++;

    // ensure the target container exists
    if ( !target && Popcorn.plugin.debug ) {
      throw new Error( "instagram target container doesn't exist" );
    }

    target && target.appendChild( containerDiv );

    // get the userid from Instagram API by using the username and access_token
    var getUserID = function() {
      if ( !_userid ) {
        _uri = "https://api.instagram.com/v1/users/search?q=" + options.username + "&access_token=" + access_token + "&callback=instagram";
        Popcorn.getJSONP(  _uri, function( data ) {
          _userid = data.data[0].id;
          getInstaData();
        });
      } else {
        getUserID();
      }
    };

    // get the photos from Instagram API by using the userid
    var getInstaData = function() {
    _uri = "https://api.instagram.com/v1/users/" + _userid + "/media/recent?count=1&access_token=" + access_token + "&callback=instagram";

    Popcorn.getJSONP( _uri, function( jsondata ) {
        var fragment = document.createElement( "p" );
        var htmlString = "";
        var userInstagramInfo = jsondata.data[ 0 ];
        htmlString = "<h3>" + userInstagramInfo.user.username + "</h3>";
        htmlString += userInstagramInfo.caption ? ("<p>" + userInstagramInfo.caption.text + "</p>") : "" ;
        htmlString += "<a href='" + userInstagramInfo.link + "' target='_blank'><img src='" + userInstagramInfo.images.low_resolution.url + "' alt='" + (userInstagramInfo.caption ? userInstagramInfo.caption.text : "" ) + "'></a>";
        fragment.innerHTML = htmlString;
        containerDiv.appendChild( fragment );
      });
    };

    if ( options.username && options.access_token ) {
      getUserID();
    }
    else {
      _userid = options.userid;
      getInstaData();
    }
    return {
      /**
       * @member Instagram
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function( event, options ) {
        containerDiv.style.display = "inline";
      },
      /**
       * @member Instagram
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        containerDiv.style.display = "none";
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( containerDiv );
      }
    }
  },
  {
    manifest: {
      about: {
        name: "Popcorn Instagram Plugin",
        version: "0.1",
        author: "Michelle Mendoza",
        website: "htttp://mendozamiche.wordpress.com"
      },
      options: {
        start: {
          elem: "input",
          type: "number",
          label: "In"
        },
        end: {
          elem: "input",
          type: "number",
          label: "Out"
        },
        username: {
          elem: "input",
          type: "text",
          label: "Username"
        },
        userid: {
          elem: "input",
          type: "text",
          label: "UserID"
        },
        access_token: {
          elem: "input",
          type: "text",
          label: "access_token"
        },
        target: "instagramdiv"
      }
    }
  });
})( Popcorn );
