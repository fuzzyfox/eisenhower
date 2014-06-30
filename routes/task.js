'use strict';

var api = require( './api/task');

module.exports = {
  list: function( req, res ) {
    api.list( req, function( tasks ) {
      tasks.forEach( function( task, idx ) {
        tasks[ idx ].taskJSON = JSON.stringify( task );
      });
      res.render( 'task/list.html', {
        title: 'Tasks',
        tasks: tasks,
        flash: req.flash()
      });
    });
  },
  create: function( req, res ) {
    res.render( 'task/create.html', {
      title: 'New Task',
      flash: req.flash()
    });
  },
  update: function( req, res ) {
    api.getById( req, function( error, task ) {
      if( error ) {
        return res.status( 404 ).render( 'error.html', { errors: error } );
      }

      res.render( 'task/create.html', {
        title: 'Update Task',
        task: task,
        flash: req.flash()
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
        taskJSON: JSON.stringify( task ),
        flash: req.flash()
      });
    });
  }
};
