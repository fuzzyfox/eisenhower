'use strict';

var api = require( './api/topic');

module.exports = {
  list: function( req, res ) {
    api.list( req, function( topics ) {
      topics.forEach( function( topic, idx ) {
        topics[ idx ].tasksJSON = JSON.stringify( topic.tasks );
      });
      res.render( 'topic/list.html', { title: 'Topics', topics: topics } );
    });
  },
  create: function( req, res ) {
    res.render( 'topic/create.html', { title: 'New Topic' } );
  },
  update: function( req, res ) {
    api.getById( req, function( topic ) {
      res.render( 'topic/update.html', { title: 'Update Topic', topic: topic } );
    });
  },
  getById: function( req, res ) {
    api.getById( req, function( topic ) {
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
