/* global $ */
'use strict';

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
      $.get( '/flash', {
        type: 'success',
        message: 'Welcome to Eisenhower!'
      }, function() {
        location.href = '/user';
      });
    });

    // on fail flash error msg, and reload page
    promise.fail( function() {
      $.get( '/flash', {
        type: 'error',
        message: 'An error occured trying to create your account.'
      }, function() {
        location.reload();
      });
    });

    return false;
  });
});
