'use strict';

var db = require( '../../models' );
var crypto = require( 'crypto' );

module.exports = {
  create: function( req, res ) {
    // sort out email
    req.body.email = req.body.email || req.session.email;
    req.body.email = req.body.email.toLowerCase();

    db.User.create({
      firstname: req.body.firstname || null,
      lastname: req.body.lastname || null,
      email: req.body.email,
      sendEngagements: ( req.body.sendEngagements === 'true' ),
      isAdmin: false
    }).success( function( user ) {
      req.session.user = user.dataValues;

      if( typeof res === 'function' ) {
        return res( null, user );
      }

      res.jsonp( user );
    });
  },
  remove: function( req, res ) {
    db.User.find({
      where: {
        id: req.params.id
      },
      include: [ db.Topic, db.Task ]
    }).success( function( user ) {
      if( user ) {
        var tmpUser = JSON.parse( JSON.stringify( user ) );

        user.tasks.forEach( function( task ) {
          task.destroy( { force: true } );
        });

        user.topics.forEach( function( topic ) {
          topic.destroy( { force: true } );
        });

        return user.destroy( { force: true } ).success( function() {
          if( typeof res === 'function' ) {
            return res( null, tmpUser );
          }

          res.jsonp( tmpUser );
        });
      }

      if( typeof res === 'function' ){
        return res( [{
          message: 'User not found',
          code: 404
        }], user );
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: 'User not found',
          code: 404
        }]
      });
    });
  },
  update: function( req, res ) {
    db.User.find({
      where: {
        id: req.params.id
      }
    }).success( function( user ) {
      if( user ) {
        // prevent non-admins getting super powers.
        if( req.body.isAdmin !== user.isAdmin && !req.session.user.isAdmin ) {
          req.body.isAdmin = false;
        }

        return user.updateAttributes({
          firstname: req.body.firstname || null,
          lastname: req.body.lastname || null,
          isAdmin: req.body.isAdmin,
          sendEngagements: req.body.sendEngagements || false
        }).success( function() {
          if( typeof res === 'function' ) {
            return res( null, user );
          }

          res.jsonp( user );
        });
      }

      if( typeof res === 'function' ){
        return res( [{
          message: 'User not found',
          code: 404
        }], user );
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: 'User not found',
          code: 404
        }]
      });
    });
  },
  details: function( req, res ) {
    db.User.find({
      where: {
        id: req.params.id
      },
      include: [ db.Topic, db.Task ]
    }).success( function( user ) {
      if( user ) {
        // get email hash
        user.emailHash = crypto.createHash( 'md5' ).update( user.email ).digest( 'hex' );

        if( typeof res === 'function' ) {
          return res( null, user );
        }

        return res.jsonp( user );
      }

      if( typeof res === 'function' ){
        return res( [{
          message: 'User not found',
          code: 404
        }], user );
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: '404 User not found',
          code: 404
        }]
      });
    });
  }
};
