'use strict';

var Habitat = require( 'habitat' );
var env = new Habitat();
Habitat.load();

var fs = require( 'fs' );
var path = require( 'path' );
var lodash = require( 'lodash' );
var Sequelize = require( 'Sequelize' );
var sequelize = new Sequelize( env.get( 'DB_CONNECTION_URI' ) );
var db = {};

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

// export the db
module.exports = lodash.extend( {
  sequelize: sequelize,
  Sequelize: Sequelize
}, db );
