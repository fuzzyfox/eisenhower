'use strict';

module.exports = function( req, res ) {
	res.render( 'login.html', {
		title: 'Login',
		redirect: req.flash( 'redirect' )
	});
};
