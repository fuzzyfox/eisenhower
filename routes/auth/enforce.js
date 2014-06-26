'use strict';

module.exports = function( req, res, next ) {
	// login is required beyond this point
	if( !req.session.email ) {
		req.flash( 'redirect', req.url );
		req.flash( 'info', 'you must login to access "' + req.url + '"' );
		return res.redirect( '/login' );
	}

	// enforce mofo email
	if( !/@mozillafoundation\.org$/.test( req.session.email ) ) {
		req.flash( 'redirect', req.url );
		req.flash( 'info', 'sorry... right now only crazy mofos can login' );
		return res.redirect( '/login' );
	}

	// all good from here
	return next();
};
