'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var lodash = require( 'lodash' );
var Sequelize = require( 'sequelize' );
var db = {};

module.exports = function( env ) {
  var sequelize = new Sequelize( env.get( 'DB_CONNECTION_URI' ), {
    logging: env.get( 'debug_db' ) ? console.log : false
  } );

  // load all definitions
  fs.readdirSync( __dirname ).filter( function( file ) {
    // return true IF not a dotfile AND not this file
    return ( ( file.indexOf( '.' ) !== 0 ) && ( file !== 'index.js' ) );
  }).forEach( function( file ) {
    var model = sequelize.import( path.join( __dirname, file ) );
    db[ model.name ] = model;
  });

  // associate models
  Object.keys( db ).forEach( function( modelName ) {
    if( 'associate' in db[ modelName ] ) {
      db[ modelName ].associate( db );
    }
  });

  return lodash.extend( {
    sequelize: sequelize,
    Sequelize: Sequelize
  }, db );
};
