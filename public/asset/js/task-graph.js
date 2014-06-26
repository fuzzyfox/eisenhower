/* globals jQuery, $, faMap */
'use strict';

// Works in modern browsers + IE9, but Modernizr has a polyfill baked in for function.bind.
// Hat tip Paul Irish
var o = $( {} );
$.subscribe = o.on.bind(o);
$.unsubscribe = o.off.bind(o);
$.publish = o.trigger.bind(o);

$(function(){
  // add the canvas to the page for drawing on
  $( 'body' ).append( '<canvas id="task-graph" width="500" height="500" style="display:none"></canvas>' );
  // set any task-graphs up w/ blank image to start
  $( 'img[rel=task-graph]' ).attr( 'src', $( '#task-graph' ).get()[0].toDataURL( 'image/png' ) );
  // prep for doing any drawings
  $( 'body' ).append( '<script type="text/paperscript" src="/asset/js/task-graph.paperscript" canvas="task-graph"></script>' );

  // wait for the mapping to complete
  $( window ).on( 'famap:ready', function() {
    setTimeout( function(){
      $( 'img[rel=task-graph]' ).each( function( idx ) {
        function generateGraph( task, imgElem ) {
          // actually plot things
          function plot( coords, ref, iconChar ) {
            $.publish( 'task:add', [ coords, ref, '#444', '#fff', iconChar.char ] );
          }

          // plot multiple points
          if( typeof task === 'array' ) {
            task.forEach( function( singleTask ) {
              plot( {
                x: singleTask.coordX,
                y: singleTask.coordY
              }, singleTask.id, faMap[ singleTask.icon ] );
            });
          }
          // plot single task
          else {
            plot( {
              x: task.coordX,
              y: task.coordY
            }, task.id, faMap[ task.icon ] );
          }

          $( imgElem ).css( 'background-image', 'none' );
          $( imgElem ).attr( 'src', $( '#task-graph' ).get()[0].toDataURL( 'image/png' ) );
          $.publish( 'tasks:clear' );
        }

        /*
          Get task(s)
         */
        var task = $( this ).data( 'task' );

        // we must have a task to plot
        if( !task ) {
          return;
        }

        // calc delay for this canvas task
        var delay = 1 * idx;
        var imgElem = this;
        // queue up canvas task
          generateGraph( task,  imgElem );
      });
    }, 1000 );
  });
});
