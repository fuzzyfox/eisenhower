/* globals unescapeFromUtf16 */

// get both the css and svg font into strings
(function( window, document, $ ) {
  'use strict';

  /**
   * Generate a map of FA icon name to unicode character
   *
   * @param  {String} css The CSS to parse
   * @return {Object}     Mappings
   */
  function generateMap( css ) {
    // regex to match icon definition
    var defRegex = /(\.fa-[a-z-]+:before\{content:"\\[a-z0-9]+"\})/ig;
    var nameRegex = /^\.fa-([a-z-]+)/i;
    var charRegex = /\{content:"\\([a-z0-9]+)"\}/i;

    // the map to fill
    var map = {};

    // get deginitions
    var defs = css.match( defRegex );

    // loop through and generate map
    defs.forEach( function( def ) {
      // get name
      var name = def.match( nameRegex )[1];
      // get char
      var character = def.match( charRegex )[1];

      map[ name ] = {
        char: unescapeFromUtf16( '\\u' + character ),
        cssChar: '\\' + character,
        jsChar: '\\u' + character
      };
      map[ 'fa-' + name ] = map[ name ];
    });

    $( window ).trigger( 'famap:ready' );
    return map;
  }

  /*
    Get Font Awesome css into a string
   */
  $.ajax({
    url: '/vendor/font-awesome/css/font-awesome.min.css',
    dataType: 'text',
    success: function( css ){
      window.faMap = generateMap( css );
    },
    error: function( xhr, status, error ) {
      console.error( xhr, status, error );
      window.faMap = {};
    }
  });

})( this, this.document, this.jQuery );
