/* globals $, convertPointToCoord, convertCoordToPoint, faMap, stateColorMap */

'use strict';

/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 *
 * The function will be called after it stops being called for N milliseconds. If `immediate`
 * is passed, trigger the function on the leading edge, instead of the trailing.
 *
 * Function taken from underscore.js
 * @see {@link http://underscorejs.org/#debounce}
 *
 * @param {Function} fn The function to debounce
 * @param {Integer} wait How many milliseconds to wait for
 * @param {Boolean} immediate Trigger function on the leading edge?
 * @return {Function} The debounced function
 */
function debounce( fn, wait, immediate ) {
  var timeout;
  return function() {
    var context = this, args = arguments;

    function later() {
      timeout = null;

      if( !immediate ) {
        fn.apply( context, args );
      }
    }

    var callNow = ( immediate && !timeout );

    clearTimeout( timeout );
    timeout = setTimeout( later, wait );

    if( callNow ) {
      fn.apply( context, args );
    }
  };
}

/**
 * Get a parameter passed through the query string
 *
 * @param  {String} variable      variable name as string
 * @param  {String} [queryString] use a different query string
 * @return {Mixed}                uri decoded value for variable OR undefined
 */
function getQueryVariable(variable, queryString){
  queryString = queryString || window.location.search;

  var query = queryString.substr( 1 ),
    vars  = query.split( '&' ), // split out variable declarations
    pairs;

  for( var i = 0, j = vars.length; i < j; i++ ) {
    pairs = vars[ i ].split( '=' ); // split into [ key, value ] pairs

    if( decodeURIComponent( pairs[ 0 ] ) === variable ) {
      return decodeURIComponent( pairs[ 1 ] );
    }
  }
}

/*
  Deal w/ task graph
 */
var existing = false;
var coords = {
  x: 0,
  y: 0
};

function _updateGraph() {
  if( existing ) {
    $.publish( 'task:remove', [ existing ] );
  }

  var x = $( '#coordX' ).val();
  var y = $( '#coordY' ).val();
  coords = {
    x: (x && x > 0) ? Math.min( x, 100 ) : Math.max( x, -100 ),
    y: (y && y > 0) ? Math.min( y, 100 ) : Math.max( y, -100 ),
  };

  var state = $( '#state' ).val();
  var fillColor = state ? stateColorMap[ state ].fillColor : undefined;
  var textColor = state ? stateColorMap[ state ].textColor : undefined;

  var iconName = $( '#icon' ).val() || $( '#icon' ).attr( 'placeholder' );
  var icon = faMap[ iconName ] || faMap[ iconName ];
  $( '#icon-preview' ).attr( 'class', 'fa fa-' + iconName );

  $.publish( 'task:add', [ coords, undefined, fillColor, textColor, icon.char ]);
  $.publish( 'task:preset', [ fillColor, textColor, icon.char ] );
}
var updateGraph = debounce( _updateGraph, 700 );
$.subscribe( 'paper:ready', _updateGraph );

$( '.form' ).on( 'keyup change', updateGraph );

$.subscribe( 'task:added', function( event, task ) {
  if( existing ) {
    $.publish( 'task:remove', [ existing ] );
  }

  coords = {
    x: Math.round( convertPointToCoord( task.point.x ) * 100 ) / 100,
    y: Math.round( -convertPointToCoord( task.point.y ) * 100 ) / 100
  };

  $( '#coordX' ).val( coords.x );
  $( '#coordY' ).val( coords.y );

  existing = task._name;
});

/*
  Deal w/ form submit
 */
$( function() {
  $( 'form' ).on( 'submit', function( event ) {
    event.preventDefault();

    // submit form
    var promise = $.post( $( this ).attr( 'action' ), $( this ).serialize() );

    // on success add flash msg and redirect to new task
    promise.done( function( task ) {
      function done() {
        $.get( '/flash', {
          type: 'success',
          message: 'Task succesfully added/updated.'
        }, function() {
          if( getQueryVariable( 'topic' ) ) {
            location.href = '/topic/' + getQueryVariable( 'topic' );
            return;
          }

          if( document.referrer ) {
            location.href = document.referrer;
            return;
          }

          location.href = '/task/' + task.id;
        });
      }

      // don't need to think about topics, we're done done
      if( !getQueryVariable( 'topic' ) ) {
        done();
      }

      // oop there seems to be a topic to...
      $.get( '/api/topic/' + getQueryVariable( 'topic' ) + '/take/' + task.id, done );
    });

    // on fail flash error msg, and reload page
    promise.fail( function() {
      $.get( '/flash', {
        type: 'error',
        message: 'Failed to create/update task.'
      }, function() {
        location.reload();
      });
    });

    return false;
  });
});
