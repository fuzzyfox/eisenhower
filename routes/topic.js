'use strict';

module.exports = function( env ) {
  var api = require( './api/topic')( env );

  return {
    list: function( req, res ) {
      api.list( req, function( error, topics ) {
        if( error ) {
          return res.status( 404 ).render( 'error.html', { errors: error } );
        }

        topics.forEach( function( topic, idx ) {
          topics[ idx ].tasksJSON = JSON.stringify( topic.tasks );
        });
        res.render( 'topic/list.html', {
          title: 'Topics',
          topics: topics
        });
      });
    },
    create: function( req, res ) {
      res.render( 'topic/create.html', {
        title: 'New Topic',
        flash: req.flash(),
        session: req.session
      });
    },
    update: function( req, res ) {
      api.getById( req, function( error, topic ) {
        if( error ) {
          return res.status( 404 ).render( 'error.html', { errors: error } );
        }

        res.render( 'topic/create.html', {
          title: 'Update Topic',
          topic: topic
        });
      });
    },
    getById: function( req, res ) {
      api.getById( req, function( error, topic ) {
        if( error ) {
          return res.status( 404 ).render( 'error.html', { errors: error } );
        }

        if( !topic ) {
          return res.status( 404 ).jsonp({
            errors: [{
              message: '404 not found',
              code: 404
            }]
          });
        }

        topic.tasks.forEach( function( task, idx ) {
          topic.tasks[ idx ].taskJSON = JSON.stringify( task );
        });

        res.render( 'topic/details.html', {
          title: 'Topic: ' + topic.name,
          topic: topic
        });
      });
    }
  };
};
