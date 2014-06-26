'use strict';

module.exports = {
	auth: {
		login: require( './auth/login' ),
		enforce: require( './auth/enforce' ),
    newUser: require( './auth/newUser' )
	},
	api: {
		task: require( './api/task' )
	},
  task: require( './task' )
};
