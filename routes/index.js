'use strict';

var fs = require( 'fs' );
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

// module.exports = {
// 	auth: {
// 		login: require( './auth/login' ),
// 		enforce: require( './auth/enforce' ),
//     newUser: require( './auth/newUser' )
// 	},
// 	api: {
// 		task: require( './api/task' ),
//     topic: require( './api/topic' )
// 	},
//   task: require( './task' ),
//   topic: require( './topic' ),
// };
