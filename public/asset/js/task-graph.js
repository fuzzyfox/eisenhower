/* globals jQuery, $, faMap */
'use strict';

// Works in modern browsers + IE9, but Modernizr has a polyfill baked in for function.bind.
// Hat tip Paul Irish
var o = $( {} );
$.subscribe = o.on.bind(o);
$.unsubscribe = o.off.bind(o);
$.publish = o.trigger.bind(o);

// state color map
var stateColorMap = {
  'pending': {
    fillColor: '#464545',
    textColor: 'white'
  },
  'complete': {
    fillColor: '#00bc8c',
    textColor: 'white'
  },
  'incomplete': {
    fillColor: '#f39c12',
    textColor: 'white'
  },
  'abandoned': {
    fillColor: '#e74c3c',
    textColor: 'white'
  },
  'ongoing': {
    fillColor: '#3498db',
    textColor: 'white'
  },
};

// do stuff when dom ready
$(function(){
  /*
    Initial setup
   */
  if( $( '#task-graph' ).length === 0 ) {
    // add the canvas to the page for drawing on
    $( 'body' ).append( '<canvas id="task-graph" width="500" height="500" style="display:none"></canvas>' );
  }
  // set any task-graphs up w/ blank image to start
  $( 'img[rel=task-graph]' ).attr( 'src', $( '#task-graph' ).get()[0].toDataURL( 'image/png' ) );
  // prep for doing any drawings
  $( 'body' ).append( '<script type="text/paperscript" src="/asset/js/task-graph.paperscript" canvas="task-graph"></script>' );

  /*
    Generate any thumbnails before using for input
   */

  // wait for the mapping to complete
  function runGraphGenerator(){
    $( 'img[rel=task-graph]' ).each( function( idx ) {
      function generateGraph( task, imgElem ) {
        // actually plot things
        function plot( coords, ref, stateColors, iconChar ) {
          $.publish( 'task:add', [ coords, ref, stateColors.fillColor, stateColors.textColor, iconChar.char ] );
        }

        // plot multiple points
        if( Array.isArray( task ) ) {
          console.log( 'multiple' );
          task.forEach( function( singleTask ) {
            plot( {
              x: singleTask.coordX,
              y: singleTask.coordY
            }, singleTask.id, stateColorMap[ singleTask.state ], faMap[ singleTask.icon ] );
          });
        }
        // plot single task
        else {
          console.log( 'single' );
          plot( {
            x: task.coordX,
            y: task.coordY
          }, task.id, stateColorMap[ task.state ], faMap[ task.icon ] );
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
      var imgElem = this;
      generateGraph( task,  imgElem );
    });
  }

  /*
    Wait for both faMap + paper to be ready
   */

  var faMapOrPaperReady = false;
  $( window ).on( 'famap:ready', function() {
    if( ! faMapOrPaperReady ) {
      faMapOrPaperReady = true;
      return;
    }

    runGraphGenerator();
  });

  $.subscribe( 'paper:ready', function() {
    if( ! faMapOrPaperReady ) {
      faMapOrPaperReady = true;
      return;
    }

    runGraphGenerator();
  });
});
