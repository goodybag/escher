var rjs = require('requirejs');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function(grunt) {
  var buildDirCMD = [
      'rm -Rf {buildDir}',
      'mkdir {buildDir}',
      'find . -depth 1 | {exclusionGrep} | while read x; do cp -R $x ./build/${x}; done'
  ].join(' && ');
  var compileToplevelCMD = 'jam compile -o ./build/jam/require.js';
  var compileAppCMD = 'jam compile -i {appPath} -i {routerPath} -e requireLib {otherExclusions} -o ./build/{appPath}.js';

  grunt.task.registerTask('compile', 'Builds an application radagast suite with jam and requirejs.', function () {
    var options = grunt.config(this.name) || {};

    // sane defaults...
    options.buildDir     = options.buildDir || './build';
    options.buildExclude = (options.buildExclude) ? [].concat(options.buildExclude) : [];
    options.buildExclude.push('./build'); // just in case (doesnt hurt to have duplicates)

    // flags
    if (this.flags['no-minify']) {
      compileToplevelCMD += ' --no-minify';
      compileAppCMD      += ' --no-minify';
    }

    // prepare data
    var buildExcludeGrep = options.buildExclude.map(function(e) { return 'grep -v "' + e + '"'; }).join('|');
    buildDirCMD = buildDirCMD
      .replace(/\{buildDir\}/g, options.buildDir)
      .replace(/\{exclusionGrep\}/g, buildExcludeGrep);
    var appPaths = collectAppPaths(options.apps);
    // :DEBUG: including the package.js in core is causing more problems than I think it's worth
    /*compileToplevelCMD = compileToplevelCMD.replace(/\{includes\}/g,
      appPaths.map(function(p) { return '-i ' + p.base + '/package'; }).join(' ')
    );*/
    compileAppCMD = appPaths.map(function(p) {
      return compileAppCMD
        .replace(/\{appPath\}/g, p.main)
        .replace(/\{routerPath\}/g, p.router)
      ;
    }).join(' && ');
    
    // execute
    var done = this.async();
    grunt.log.writeln('Creating build directory');
    grunt.log.writeln('\033[0;30m'+buildDirCMD+'\033[1;37m');
    exec(buildDirCMD, function(err, stdout, stderr) {
      if (err) throw stderr;

      grunt.log.writeln('Compiling top-level');
      grunt.log.writeln('\033[0;30m'+compileToplevelCMD+'\033[1;37m');
      exec(compileToplevelCMD, function(err, stdout, stderr) {
        if (err) throw stderr;
        grunt.log.writeln(stdout);

        compileAppCMD = excludeWhatToplevelIncluded(stdout, compileAppCMD);
        grunt.log.writeln('Compiling applications');
        grunt.log.writeln('\033[0;30m'+compileAppCMD+'\033[1;37m');
        exec(compileAppCMD, function(err, stdout, stderr) {
          if (err) { console.log(stdout, stderr, err); throw stderr; }
          grunt.log.writeln(stdout);
          done();
        });
      });
    });
  });

  function collectAppPaths(apps) {
    var appPaths = [];
    if (apps) {
      apps.forEach(function(app) {
        // the packages use a define call to export their config
        // this define function grabs that config and adds it to our modules
        var define = function(pkgFn) {
          appPaths.push({
            base   : app,
            main   : path.join(app, pkgFn().path),
            router : path.join(app, 'router')
          });
        };

        // load the package js and eval it in this scope
        var pkgRawJS = fs.readFileSync(path.join(process.cwd(), app, 'package.js'), 'utf8');
        eval(pkgRawJS);
      });
    }
    return appPaths;
  }

  function excludeWhatToplevelIncluded(stdout, cmd) {
    // parse out what the toplevel included
    var includes = /include \u001b\[39m(.*)/.exec(stdout);
    //console.log('includes', includes[1]);
    var excludes = includes[1].split(', ').map(function(item) { return '-E '+item; }).join(' ');
    //console.log('excludes', excludes);
    return cmd.replace(/\{otherExclusions\}/g, excludes);
  }
};
