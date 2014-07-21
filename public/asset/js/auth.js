/* globals jQuery, $ */

'use strict';

var redirectURL = $( 'script[data-redirect]' ).data( 'redirect' );

// handlers for persona login/out buttons
$( '.persona-login' ).on( 'click', function() {
  navigator.id.request();
  return false;
});
$( '.persona-logout' ).on( 'click', function() {
  navigator.id.logout();
  return false;
});

// deal w/ login
function onlogin( assertion ) {
  $.post( '/persona/verify', {
    assertion: assertion
  }, function( data ) {
    if( data.status === 'okay' ) {
      console.log( 'you have been logged in' );
      if( redirectURL ) {
        location.href = redirectURL;
        return;
      }

      if( !/@mozillafoundation\.org$/.test( data.email ) ) {
        $.post( 'flash', {
          type: 'info',
          msg: 'sorry... right now only crazy mofos can login'
        }, function() {
          navigator.id.logout();
        });
      }

      if( location.pathname === '/login' ) {
        location.href = '/';
        return;
      }

      if( $( '.persona-logout' ).length === 0 ) {
        location.reload( true );
      }
    }
  });
}

// deal w/ logout
function onlogout() {
  $.post( '/persona/logout', function( data ) {
    if( $( '.persona-logout' ).length > 0 ) {
      location.reload( true );
    }
  });
}

// watch for login/logout events
navigator.id.watch({
  onlogin: onlogin,
  onlogout: onlogout
});
