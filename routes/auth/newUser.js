'use strict';

var db = require( '../../models' );

module.exports = function( req, res, next ) {
  db.User.find( { where: { email: req.session.email.toLowerCase() } } ).success( function( user ) {
    if( user ) {
      user.lastLogin = ( new Date() ).toISOString();
      user.save(); // fire + forget

      req.session.user = user.dataValues;
      return next();
    }

    console.log( req.url );
    if( req.url !== '/user/new' && req.url !== '/api/user/new' ) {
      res.redirect( '/user/new' );
    }

    next();
  });
};
