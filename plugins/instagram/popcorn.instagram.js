// PLUGIN: Instagram
(function( Popcorn ) {
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
  var idx = 0;

  Popcorn.plugin( "instagram", function( options ){
    var access_token = options.access_token,
        target = document.getElementById( options.target ),
        containerDiv,
        _userid,
        _uri;

    // create a new div this way anything in the target div is left intact
    // this is later populated with instagram images
    containerDiv = document.createElement( "div" );
    containerDiv.id = "instagram" + idx;
    idx++;

    var containerStyle = containerDiv.style;
    containerStyle.width = "100%";
    containerStyle.height = "100%";
    containerStyle.display = "none";

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

      if (!access_token){
        var divText = document.createElement( "p" );
        divText.innerHTML = "Instagram function parameters required";
        containerDiv.appendChild( divText );
      } else {
        if ( !_userid ) {
          var _tag = "html5";
          _uri = "https://api.instagram.com/v1/tags/" + _tag + "/media/recent?access_token=" + access_token + "&callback=instagram";
        } else {
          _uri = "https://api.instagram.com/v1/users/" + _userid + "/media/recent?count=1&access_token=" + access_token + "&callback=instagram";
        }
        Popcorn.getJSONP( _uri, function( jsondata ) {

          var userInstagramInfo = jsondata.data[ 0 ],
              usernameHeading   = document.createElement( "h3" ),
              caption           = document.createElement( "p" ),
              instagramAnchor   = document.createElement( "a" ),
              picImgSrc         = document.createElement( "img" );

          usernameHeading.innerText = userInstagramInfo.user.username;

          caption.innerHTML = userInstagramInfo.caption ? ( userInstagramInfo.caption.text) : "" ;

          picImgSrc.setAttribute( 'src' , userInstagramInfo.images.low_resolution.url );
          picImgSrc.setAttribute( 'alt' , (userInstagramInfo.caption ? userInstagramInfo.caption.text : "" ) );

          instagramAnchor.setAttribute( 'href' , userInstagramInfo.link);
          instagramAnchor.setAttribute( 'target' , '_blank');
          instagramAnchor.appendChild( picImgSrc );

          containerDiv.appendChild( usernameHeading );
          containerDiv.appendChild( caption );
          containerDiv.appendChild( instagramAnchor );
        });
      }
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
        containerStyle.display = "inline";
      },
      /**
       * @member Instagram
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function( event, options ) {
        containerStyle.display = "none";
      },
      _teardown: function( options ) {
        document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( containerDiv );
      }
    };
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
