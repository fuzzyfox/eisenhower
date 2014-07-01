'use strict';

var db = require( '../../models' );

module.exports = {
	create: function( req, res ) {
		db.User.find({
      where: {
        email: req.session.email
      },
      include: [ db.Task ]
    }).success( function( user ) {
      db.Task.create({
        name: req.body.name.trim(),
        notes: req.body.notes.trim(),
        url: req.body.url.trim() || null,
        icon: req.body.icon.trim() || 'square-o',
        coordX: req.body.coordX || null,
        coordY: req.body.coordY || null,
        state: req.body.state
      }).success( function( task ) {
        task.setUser( user ).success( function() {
          if( typeof res === 'function' ){
            return res( task.dataValues );
          }

          res.jsonp( task.dataValues );
        });
      });
    });
	},
	remove: function( req, res ) {
		db.Task.find({
      where: {
        id: req.params.id,
        UserId: req.session.user.id
      }
    }).success( function( task ) {
      var tmpTask = JSON.parse( JSON.stringify( task ) );
      task.destroy().success( function() {
        res.jsonp( tmpTask );
      });
    });
	},
	update: function( req, res ) {
		db.Task.find({
      where: {
        id: req.params.id,
        UserId: req.session.user.id
      }
    }).success( function( task ) {
      if( task ) {
        return task.updateAttributes({
          name: req.body.name.trim(),
          notes: req.body.notes.trim(),
          url: req.body.url.trim() || null,
          icon: req.body.icon.trim() || 'square-o',
          coordX: req.body.coordX || null,
          coordY: req.body.coordY || null,
          state: req.body.state
        }).success( function() {
          if( typeof res === 'function' ){
            return res( null, task );
          }

          return res.jsonp( task );
        });
      }

      if( typeof res === 'function' ){
        return res( [{
          message: 'Task not found',
          code: 404
        }], task );
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: 'Task not found',
          code: 404
        }]
      });
    });
	},
	list: function( req, res ) {
    db.Task.findAll( {
      where: {
        UserId: req.session.user.id
      },
    }).success( function( tasks ) {
      tasks = tasks.filter( function( task ) {
        return !task.isDeleted;
      });

      if( typeof res === 'function' ){
        return res( tasks );
      }

      res.jsonp( tasks );
    });
	},
	getById: function( req, res ) {
		db.Task.find( {
      where: {
        id: req.params.id,
        UserId: req.session.user.id
      },
      include: [ db.Topic ]
    }).success( function( task ) {
      if( task ) {
        if( typeof res === 'function' ){
          return res( null, task );
        }

        return res.jsonp( task );
      }

      if( typeof res === 'function' ){
        return res( [{
          message: 'Task not found',
          code: 404
        }], task );
      }

      res.status( 404 ).jsonp({
        errors:  [{
          message: 'Task not found',
          code: 404
        }]
      });
    });
	}
};
