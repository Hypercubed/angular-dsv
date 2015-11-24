module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),

    jshint: {
      options: { jshintrc: true },
      all: ['gruntfile.js', '<%= pkg.name %>.js']
    }

  });

  require('load-grunt-tasks')(grunt);

};
