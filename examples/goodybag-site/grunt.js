/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    compile: {
      buildDir: './build',
      buildExclude: ['./build'],
      apps: [
        "apps/application-suite",
        "apps/landing-site",
        "apps/consumer-panel"
      ]
    }
  });

  // Default task.
  grunt.registerTask('default', 'compile');

  // Load rad tasks
  grunt.loadTasks('../../build');
};
