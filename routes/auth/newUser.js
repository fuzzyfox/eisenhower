'use strict';

var db = require( '../../models' );

module.exports = function( req, res, next ) {
  db.User.find( { where: { email: req.session.email } } ).success( function( user ) {
    if( user !== null ) {
      user.lastLogin = ( new Date() ).toISOString();
      user.save(); // fire + forget

      req.session.user = user.dataValues;
      return next();
    }

    db.User.create( {
      firstname: null,
      lastname: null,
      email: req.session.email.toLowerCase(),
      isAdmin: false
    } ).success( function( user ) {
      req.flash( 'info', 'Hey there. Welcome to Eisenhower' );
      req.session.user = user.dataValues;
      return next();
    });
  });
};
