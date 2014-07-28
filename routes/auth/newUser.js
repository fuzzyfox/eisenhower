'use strict';

module.exports = function( env ) {
  var db = require( '../../models' )( env );

  return function( req, res, next ) {
    db.User.find( { where: { email: req.session.email.toLowerCase() } } ).success( function( user ) {
      if( user ) {
        user.lastLogin = ( new Date() ).toISOString();
        return user.save().success( function() {
          req.session.user = user.dataValues;
          next();
        });
      }

      if( req.url !== '/user/new' && req.url !== '/api/user/new' ) {
        res.redirect( '/user/new' );
      }

      next();
    });
  };
};
