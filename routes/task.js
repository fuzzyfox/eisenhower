'use strict';

var api = require( './api/task');

module.exports = {
  list: function( req, res ) {
    api.list( req, function( tasks ) {
      tasks.forEach( function( task, idx ) {
        tasks[ idx ].taskJSON = JSON.stringify( task );
      });
      res.render( 'task/list.html', { title: 'Tasks', tasks: tasks } );
    });
  },
  create: function( req, res ) {
    res.render( 'task/create.html', { title: 'New Task' } );
  },
  update: function( req, res ) {
    api.getById( req, function( task ) {
      res.render( 'task/update.html', { title: 'Update Task', task: task } );
    });
  },
  getById: function( req, res ) {
    api.getById( req, function( task ) {
      if( !task ) {
        return res.status( 404 ).jsonp({
          errors: [{
            message: '404 not found',
            code: 404
          }]
        });
      }

      res.render( 'task/details.html', {
        title: 'Task: ' + task.name,
        task: task,
        taskJSON: JSON.stringify( task )
      });
    });
  }
};
