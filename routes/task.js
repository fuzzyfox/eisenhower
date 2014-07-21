'use strict';

var api = require( './api/task');
var getTopicList = require( './api/topic' ).list;

module.exports = {
  list: function( req, res ) {
    api.list( req, function( tasks ) {
      tasks.forEach( function( task, idx ) {
        tasks[ idx ].taskJSON = JSON.stringify( task );
      });
      res.render( 'task/list.html', {
        title: 'Tasks',
        tasks: tasks
      });
    });
  },
  create: function( req, res ) {
    getTopicList( req, function( error, topics ) {
      res.render( 'task/create.html', {
        title: 'New Task',
        task: {
          coordX: req.query.coordX || undefined,
          coordY: req.query.coordY || undefined,
        },
        topics: topics
      });
    });
  },
  update: function( req, res ) {
    getTopicList( req, function( error, topics ) {
      api.getById( req, function( error, task ) {
        if( error ) {
          return res.status( 404 ).render( 'error.html', { errors: error } );
        }

        res.render( 'task/create.html', {
          title: 'Update Task',
          task: task,
          topics: topics
        });
      });
    });
  },
  getById: function( req, res ) {
    api.getById( req, function( error, task ) {
      console.log( error );
      if( error !== null ) {
        return res.status( 404 ).render( 'error.html', { errors: error } );
      }

      res.render( 'task/details.html', {
        title: 'Task: ' + task.name,
        task: task,
        taskJSON: JSON.stringify( task )
      });
    });
  }
};
