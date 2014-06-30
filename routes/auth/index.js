'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var lodash = require( 'lodash' );
var routes = {};

// load all definitions
fs.readdirSync( __dirname ).filter( function( file ) {
  // return true IF not a dotfile AND not this file
  return ( ( file.indexOf( '.' ) !== 0 ) && ( file !== 'index.js' ) );
}).forEach( function( file ) {
  file = file.split( '.' ) [ 0 ];
  routes[ file ] = require( './' + file );
});

module.exports = routes;
