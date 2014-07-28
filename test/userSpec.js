/* global before */
'use strict';

// load libraries
var Habitat = require( 'habitat' );
var supertest = require( 'supertest' );
var should = require( 'chai' ).should();
var request = require( 'request' );

// configure
var env = new Habitat();
Habitat.load( __dirname + '/../.env-test' );

// load db
var db = require( '../models' )( env );

// configure supertest
supertest = supertest( 'http://localhost:' + env.get( 'port' ) );

// test api
describe( 'api', function() {
  var UserId = 0;

  before( function( done ) {
    db.sequelize.sync({ force: env.get( 'DB_FORCE_SYNC' ) }).complete( function( error ) {
      if( error ) {
        return console.error( error );
      }

      return done();
    });
  });

  it( 'should exist', function( done ) {
    supertest
      .get( '/healthcheck' )
      .set( 'Accept', 'application/json' )
      .expect( 'Content-Type', /json/ )
      .expect( 200 )
      .expect( function( res ) {
        // must have http key
        if( ! ( 'http' in res.body ) ) {
          return new Error( 'missing http key' );
        }

        // must have version key
        if( ! ( 'version' in res.body ) ) {
          return new Error( 'missing version key' );
        }

        // if we get here then the api exists
        return false;
      })
      .end( done );
  });

  describe( 'user model', function() {
    it( 'should create new user', function( done ) {
      supertest
        .post( '/api/user/new' )
        .send({
          email: env.get( 'test_user' )
        })
        .set( 'Accept', 'application/json' )
        .expect( 'Content-Type', /json/ )
        .expect( 200 )
        .expect( function( res ) {
          UserId = res.body.id;
          // supertest wants falsy on success..?
          return ! res.body.should.deep.equal({
            id: res.body.id, // we dont care what the id is
            email: env.get( 'test_user' ), // check the email matches what we gave
            isAdmin: false, // no user should be created as an admin
            sendEngagements: false,   // not set so false
            sendNotifications: false, // not set so false
            firstname: null, // not provided so null
            lastname: null,  // not provided so null
            createdAt: res.body.updatedAt, // dont care what it is as long as its the same as createdAt
            updatedAt: res.body.createdAt  // dont care what it is as long as its the same as updatedAt
          });
        })
        .end( done );
    });

    it( 'should update user', function( done ) {
      supertest
        .post( '/api/user/update/' + UserId )
        .send({
          firstname: 'John',
          lastname: 'Smith',
          sendEngagements: true
        })
        .set( 'Accept', 'application/json' )
        .expect( 'Content-Type', /json/ )
        .expect( 200 )
        .expect( function( res ) {
          // supertest wants falsy on success..?
          return ! res.body.should.deep.equal({
            id: UserId, // should remain unchanged
            email: env.get( 'test_user' ), // check email remains unchanged
            isAdmin: false, // check admin status remains unchanged
            sendEngagements: true,   // changed to true
            sendNotifications: false, // not changed
            firstname: 'John', // changed to John
            lastname: 'Smith',  // changed to Smith
            lastLogin: res.body.updatedAt, // should match time of last change
            createdAt: res.body.createdAt, // dont care
            updatedAt: res.body.lastLogin  // shoud match time of last login
          });
        })
        .end( done );
    });

    it( 'should return user details', function( done ) {
      supertest
        .get( '/api/user/' + UserId )
        .set( 'Accept', 'application/json' )
        .expect( 'Content-Type', /json/ )
        .expect( 200 )
        .expect( function( res ) {
          // supertest wants falsy on success..?
          return ! res.body.should.deep.equal({
            id: UserId,
            email: env.get( 'test_user' ),
            isAdmin: false,
            sendEngagements: true,
            sendNotifications: false,
            firstname: 'John',
            lastname: 'Smith',
            lastLogin: res.body.updatedAt,
            createdAt: res.body.createdAt,
            updatedAt: res.body.lastLogin,
            topics: [],
            tasks: []
          });
        })
        .end( done );
    });

    it( 'should delete user', function( done ) {
      supertest
        .post( '/api/user/delete/' + UserId )
        .set( 'Accept', 'application/json' )
        .expect( 'Content-Type', /json/ )
        .expect( 200 )
        .expect( function( res ) {
          // supertest wants falsy on success..?
          return ! res.body.should.deep.equal({
            id: UserId, // should remain unchanged
            email: env.get( 'test_user' ), // check email remains unchanged
            isAdmin: false, // check admin status remains unchanged
            sendEngagements: true,   // changed to true
            sendNotifications: false, // not changed
            firstname: 'John', // changed to John
            lastname: 'Smith',  // changed to Smith
            lastLogin: res.body.updatedAt, // should match time of last change
            createdAt: res.body.createdAt, // dont care
            updatedAt: res.body.lastLogin,  // shoud match time of last login
            topics: [], // empty topic array as we didn't create any topics
            tasks: [] // empty task array as we didn't create any tasks
          });
        })
        .end( done );
    });
  });
});
