'use strict';

var db = require( '../../models' );

module.exports = {
  create: function( req, res ) {
    db.User.find({
      where: {
        email: req.session.email
      },
      include: [ db.Topic ]
    }).success( function( user ) {
      db.Topic.create({
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        isActive: true
      }).success( function( topic ) {
        topic.setUser( user ).success( function() {
          if( typeof res === 'function' ){
            return res( topic.dataValues );
          }

          res.jsonp( topic.dataValues );
        });
      });
    });
  },
  remove: function( req, res ) {
    db.Topic.find({
      where: {
        id: req.params.id,
        UserId: req.session.user.id
      }
    }).success( function( topic ) {
      if( topic ) {
        var tmpTopic = JSON.parse( JSON.stringify( topic ) );
        return topic.destroy().success( function() {
          res.jsonp( tmpTopic );
        });
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: '404 not found',
          code: 404
        }]
      });
    });
  },
  update: function( req, res ) {
    db.Topic.find({
      where: {
        id: req.params.id,
        UserId: req.session.user.id
      }
    }).success( function( topic ) {
      if( topic ) {
        return topic.updateAttributes({
          name: req.body.name.trim(),
          description: req.body.description.trim(),
          isActive: req.body.isActive || true
        }).success( function() {
          if( typeof res === 'function' ){
            return res( topic );
          }

          return res.jsonp( topic );
        });
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: '404 not found',
          code: 404
        }]
      });
    });
  },
  list: function( req, res ) {
    db.Topic.findAll( {
      where: {
        UserId: req.session.user.id
      },
      include: [ db.Task ]
    }).success( function( topics ) {
      topics = topics.filter( function( topic ) {
        return topic.isActive;
      });

      db.Task.findAll( {
        where: {
          TopicId: null,
          UserId: req.session.user.id
        }
      }).success( function( specialTasks ) {
        if( specialTasks.length > 0 ) {
          var special = db.Topic.build({
            id: 0,
            name: 'Catch-All',
            description: 'This is a special topic to catch all tasks not accociated to a topic.'
          });
          special.tasks = specialTasks;

          topics = [special].concat( topics );
        }

        if( typeof res === 'function' ){
          return res( topics );
        }

        res.jsonp( topics );
      });
    });
  },
  getById: function( req, res ) {
    if( req.params.id == 0 ) {
      return db.Task.findAll( {
        where: {
          TopicId: null,
          UserId: req.session.user.id
        }
      }).success( function( specialTasks ) {
        var special = db.Topic.build({
          id: 0,
          name: 'Catch-All',
          description: 'This is a special topic to catch all tasks not accociated to a topic.'
        });
        special.tasks = specialTasks;

        if( typeof res === 'function' ){
          return res( special );
        }

        res.jsonp( special );
      });
    }

    db.Topic.find( {
      where: {
        id: req.params.id,
        UserId: req.session.user.id
      },
      include: [ db.Task ]
    }).success( function( topic ) {
      if( topic ) {
        if( typeof res === 'function' ){
          return res( topic );
        }

        return res.jsonp( topic );
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: '404 not found',
          code: 404
        }]
      });
    });
  },
  take: function( req, res ) {
    db.Topic.find({
      where: {
        id: req.params.TopicId,
        UserId: req.session.user.id
      },
      include: [ db.Task ]
    }).success( function( topic ) {
      if( topic ) {
        return db.Task.find({
          where: {
            id: req.params.TaskId,
            UserId: req.session.user.id
          }
        }).success( function( task ) {
          if( task ) {
            return task.setTopic( topic ).success( function() {
              topic.tasks.push( task );

              if( typeof res === 'function' ){
                return res( topic );
              }

              return res.jsonp( topic );
            });
          }

          return res.status( 404 ).jsonp({
            errors: [{
              message: '404 Task not found',
              code: 404
            }]
          });
        });
      }

      return res.status( 404 ).jsonp({
        errors: [{
          message: '404 Topic not found',
          code: 404
        }]
      });
    });
  }
};
