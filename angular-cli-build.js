'use strict';
/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');
var compileSass = require('broccoli-sass');
var mergeTrees = require('broccoli-merge-trees');
var _ = require('lodash');
var glob = require('glob');

module.exports = function(defaults) {
  
  let sourceDir = 'src';
  let app = new Angular2App(defaults, {
      sourceDir: sourceDir,
      sassCompiler: {
        includePaths: [
          'public/style'
        ]
      },
      vendorNpmFiles: [
        'systemjs/dist/system-polyfills.js',
        'systemjs/dist/system.src.js',
        'zone.js/dist/*.js',
        'es6-shim/es6-shim.js',
        'reflect-metadata/*.js',
        'rxjs/**/*.js',
        '@angular/**/*.js',
        'd3/d3.js',
        'three/build/three.js'
      ]
    });
    let styles = mergeTrees(_.map(glob.sync('public/**/*.scss'), function(sassFile) {
        sassFile = sassFile.replace('public/', '');
        return compileSass(['public'], sassFile, sassFile.replace(/.scss$/, '.css'));
    }));
    return mergeTrees([styles, app], { overwrite: true });
};