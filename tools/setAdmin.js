'use strict';

// laod env
var Habitat = require( 'habitat' );
var env = new Habitat();
Habitat.load();

// load db models
var db = require( '../models' )( env );

// command prompt aid
var readline = require( 'readline' );
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// regex to validate email is real
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// output script banner
var banner = '\n\nSet administrator by email.\n\n' +
             'You will be repeatedly prompted for emails until a blank \n' +
             'line is detected indicating no more emails to be provided.\n' +
             '----------------------------------------------------------\n';
console.log( banner );

// get email(s) and set them as admins
(function getEmail() {
  rl.question( 'Email to set as admin: ', function( email ) {
    if( emailRegex.test( email ) ) {
      return db.User.find({
        where: {
          email: email
        }
      }).done( function( error, user ) {
        if( !user ) {
          console.log( '%s is not currently a user. Cannot set as admin.\n', email );

          return getEmail();
        }

        user.updateAttributes({
          isAdmin: true
        }).success( function( user ) {
          console.log( '%s was set as admin.\n', user.email );

          return getEmail();
        });
      });
    }

    // check if empty response (indicating exit)
    if( email === '' ) {
      rl.close();
      return;
    }

    console.log( '%s did not validate as an email address.\n', email );

    return getEmail();
  });
}());
