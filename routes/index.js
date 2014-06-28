'use strict';

module.exports = {
	auth: {
		login: require( './auth/login' ),
		enforce: require( './auth/enforce' ),
    newUser: require( './auth/newUser' )
	},
	api: {
		task: require( './api/task' ),
    topic: require( './api/topic' )
	},
  task: require( './task' ),
  topic: require( './topic' ),
};
