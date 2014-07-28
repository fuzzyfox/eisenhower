'use strict';

module.exports = function( env ) {
  return function( req, res ) {
    res.render( 'login.html', {
      title: 'Login',
      redirect: req.flash( 'redirect' ),
      session: req.session
    });
  };
};
