module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    banner: '/**\n' +
            ' * <%= pkg.name %>\n *\n' +
            ' * <%= pkg.description %>\n *\n' +
            ' * @project <%= pkg.name %>\n' +
            ' * @version v<%= pkg.version %>\n' +
            ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
            ' * @copyright grunt.template.today("yyyy") by the author\n' +
            ' * @license <%= pkg.license %>\n' +
            ' */\n\n',

    // hint all the things
    jshint: {
      options: {
        'globals': {
          'module': false,
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

    // run server in dev environment
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

    // compile styles
    less: {
      development: {
        files: {
          'public/asset/css/eisenhower.css': 'public/asset/less/eisenhower.less'
        }
      },
      production: {
        options: {
          cleancss: true,
          sourceMap: true
        },
        files: {
          'public/asset/css/eisenhower.css': 'public/asset/less/eisenhower.less'
        }
      }
    },

    // add banner to css + js
    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [ 'public/asset/css/eisenhower.css' ]
      }
    },

    // run tasks on file changes
    watch: {
      files: [
        '*.js',
        'models/*.js',
        'routes/*.js',
        'routes/*/*.js',
        'public/asset/js/*.js',
        'public/asset/styl/*.styl'
      ],
      tasks: [ 'jshint', 'less', 'express:dev' ],
      express: {
        files: [ '*.js', 'models/**/*.js', 'routes/**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false
        }
      }
    },

    // bump version number
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
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-express-server' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask( 'default', [ 'jshint', 'less:development', 'express:dev', 'watch' ] );
  grunt.registerTask( 'build', [ 'less:production', 'usebanner' ] );
  grunt.registerTask( 'test', [ 'jshint' ] );
};
