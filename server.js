'use strict';

var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );
var session = require( 'express-session' );
var flash = require( 'connect-flash' );
var morgan = require( 'morgan' );
var Habitat = require( 'habitat' );
var nunjucks = require( 'nunjucks' );
var routes = require( './routes' );
var db = require( './models' );

// setup environment
var env = new Habitat();
Habitat.load();

// custom debug function (console.log only when debug flag set)
// function debug() {
//   if( env.get( 'debug' ) ) {
//     return console.log.apply( null, arguments );
//   }
//   return;
// }

// setup server
var app = express();
app.use( express.static( __dirname + '/public' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cookieParser() );
app.use( session( { secret: env.get( 'session_secret' ) } ) );
app.use( flash() );
if( env.get( 'debug' ) ) {
	app.use( morgan( 'dev' ) );
}

// setup nunjucks
nunjucks.configure( 'views', {
	autoescape: true,
	express: app
});

// healthcheck
app.get( '/healthcheck', function( req, res ) {
	res.jsonp({
		version: require( './package' ).version,
		http: 'okay'
	});
});

// landing pages
app.get( '/', function( req, res ) {
	res.render( 'index.html', {
    title: 'Home',
    flash: req.flash()
  });
});

app.get( '/paper-test', function( req, res ) {
  res.render( 'paper-test.html', {
    title: 'Paper Test',
    flash: req.flash()
  });
});

// auth barrier
if( env.get( 'persona_audience' ) ) {
	// setup persona
	require( 'express-persona' )( app, {
		audience: env.get( 'persona_audience' )
	});

	// allow login before we launch
	app.get( '/login', routes.auth.login );
}
else if( env.get( 'node_env' ) === 'development' ) {
  // dumb development login mechanism
  app.get( '/login', function( req, res ) {
    // load fake login form
    res.render( 'dumb_login.html', { title: 'Dumby Login', redirect: req.flash( 'redirect' ) } );
  });
  app.post( '/login', function( req, res ) {
    req.session.email = req.body.email;
    res.redirect( req.body.redirect );
  });
}
else {
  console.error( 'failed to launch... can\'t no auth method' );
  process.exit( 1 );
}

// enforce login from here on
app.all([
  '/api/*',
  '/user',
  '/user/*',
  '/topics',
  '/topic/*',
  '/task*',
  '/task/*',
], routes.auth.enforce, routes.auth.newUser );

// no cache on api routes
app.all( '/api/*', function( req, res, next ) {
	res.set({
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		'Pragma': 'no-cache',
		'Expires': '0'
	});
	return next();
});

/*
  Tasks
 */

// ui routes for tasks
app.get( '/tasks', routes.task.list );
app.get( '/task/new', routes.task.create );
app.get( '/task/:id', routes.task.getById );
app.get( '/task/update/:id', routes.task.update );

// api routes for tasks
app.get( '/api/tasks', routes.api.task.list );
app.post( '/api/task/new', routes.api.task.create );
app.get( '/api/task/:id', routes.api.task.getById );
app.post( '/api/task/update/:id', routes.api.task.update );
app.get( '/api/task/delete/:id', routes.api.task.remove );

/*
  Topics
 */

// ui routes for topics
app.get( '/topics', routes.topic.list );
app.get( '/topic/new', routes.topic.create );
app.get( '/topic/:id', routes.topic.getById );
app.get( '/topic/update/:id', routes.topic.update );

// api routes for topics
app.get( '/api/topics', routes.api.topic.list );
app.post( '/api/topic/new', routes.api.topic.create );
app.get( '/api/topic/:id', routes.api.topic.getById );
app.get( '/api/topic/:TopicId/take/:TaskId', routes.api.topic.take );
app.post( '/api/topic/update/:id', routes.api.topic.update );
app.get( '/api/topic/delete/:id', routes.api.topic.remove );

/*
  Users
 */

// ui routes for users
app.get( '/user/new', routes.user.create );
app.get( '/user/:id?', function( req, res ) {
  if( !req.params.id ) {
    req.params.id = req.session.user.id;
  }
  routes.user.details( req, res );
});

// api routes for users
app.get( '/api/user/:id?', function( req, res ) {
  if( !req.params.id ) {
    req.params.id = req.session.user.id;
  }

  routes.api.user.details( req, res );
});
app.post( '/api/user/new', routes.api.user.create );

// not found
app.get( '*', function( req, res ) {
  res.status(404).render( 'error.html', {
    errors: [{
      message: 'Page not found',
      code: 404
    }]
  });
});
app.post( '*', function( req, res ) {
  res.status( 404 ).jsonp({
    errors: [{
      message: 'Page not found',
      code: 404
    }]
  });
});

// setup db + launch server
db.sequelize.sync({ force: env.get( 'DB_FORCE_SYNC' ) }).complete( function( error ) {
  if( error ) {
    return console.error( error );
  }

  var server = app.listen( env.get( 'port' ) || 3000, function() {
    console.log( 'Now listening on %d', server.address().port );
  });
});
