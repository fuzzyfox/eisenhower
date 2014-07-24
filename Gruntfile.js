module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    jshint: {
      options: {
        'globals': {
          'module': false,
          'angular': false,
          'console': false,
          'google': false,
          'WebmakerAuthClient': false
        },
        'bitwise': true,
        'browser': true,
        'curly': true,
        'eqeqeq': true,
        'freeze': true,
        'immed': true,
        'indent': 2,
        'latedef': true,
        'node': true,
        'newcap': true,
        'noempty': true,
        'quotmark': 'single',
        'trailing': true,
        'undef': true,
        'unused': 'vars'
      },
      files: [
        'Gruntfile.js',
        '*.js',
        'models/**/*.js',
        'routes/**/*.js',
        'public/js/**/*.js'
      ]
    },

    express: {
      dev: {
        options: {
          script: './server.js',
          args: [ '--debug' ],
          node_env: 'development',
          port: 4321
        }
      }
    },

    stylus: {
      compile: {
        files: {
          'public/asset/css/eisenhower.css': 'public/asset/styl/eisenhower.styl'
        }
      }
    },

    watch: {
      files: [
        '*.js',
        'models/*.js',
        'routes/*.js',
        'routes/*/*.js',
        'public/asset/js/*.js',
        'public/asset/styl/*.styl'
      ],
      tasks: [ 'jshint', 'stylus', 'express:dev' ],
      express: {
        files: [ '*.js', 'models/*.js', 'routes/*.js', 'routes/*/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      }
    },

    bump: {
      options: {
        files: [ 'package.json', 'bower.json' ],
        commit: true,
        commitMessage: 'version bump to v%VERSION%',
        commitFiles: [ 'package.json', 'bower.json' ],
        createTag: true,
        tagName: 'v%VERSION%',
        push: false
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-stylus' );
  grunt.loadNpmTasks( 'grunt-express-server' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask( 'default', [ 'jshint', 'stylus', 'express:dev', 'watch' ] );
  grunt.registerTask( 'test', [ 'jshint' ] );
};
