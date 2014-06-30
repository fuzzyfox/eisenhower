'use strict';

var api = require( './api/user' );

module.exports = {
  create: function( req, res ) {
    if( req.session.user && !req.session.user.isAdmin ) {
      req.flash( 'warning', 'Oops, something went wrong.' );
      return res.redirect( '/user' );
    }

    res.render( 'user/create.html', {
      title: 'New user',
      flash: req.flash()
    });
  },
  remove: function( req, res ) {
    // code to come
    res.send( req.url );
  },
  update: function( req, res ) {
    // code to come
    res.send( req.url );
  },
  details: function( req, res ) {
    api.details( req, function( error, user ) {
      if( error ) {
        return res.status( 404 ).render( 'error.html', { errors: error } );
      }

      res.render( 'user/details.html', {
        title: 'User details',
        user: user,
        flash: req.flash()
      });
    });
  }
};
