module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),

    jshint: {
      options: { jshintrc: true },
      all: ['gruntfile.js', '<%= pkg.name %>.js']
    },

    bump: {
      options: {
        files: ['bower.json','package.json'],
        commit: true,
        commitMessage: 'release %VERSION%',
        commitFiles: ['package.json','bower.json','<%= pkg.name %>.min.js'],
        pushTo: 'origin',
        push: true,
      }
    },

    uglify: {
      options: {
        banner: '/*\n * <%= pkg.title || pkg.name %> <%= pkg.version %>\n' +
          ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.authors.join(" ") %>\n' +
          ' * Licensed <%= pkg.license %>\n */\n'
      },
      src: {
        files: {
          '<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      once: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      server: {
        configFile: 'karma.conf.js',
        singleRun: false,
        autoWatch: true,
        browsers: ['PhantomJS']
      }
    },

    //'gh-pages': {
    //  src: ['<%= pkg.name %>.js','<%= pkg.name %>.min.js','bower_components/**/*','example/*']
   // }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jshint', 'test', 'uglify']);
  grunt.registerTask('test', ['karma:once']);
  grunt.registerTask('publish', ['jshint','test','bump-only','uglify','bump-commit']);

};
