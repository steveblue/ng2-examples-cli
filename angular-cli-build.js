'use strict';
/* global require, module */

const Angular2App = require('angular-cli/lib/broccoli/angular2-app');
const compileSass = require('broccoli-sass');
const compileCSS = require('broccoli-postcss');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const mergeTrees = require('broccoli-merge-trees');
const _ = require('lodash');
const glob = require('glob');


var options =  {
  plugins: [
    {
      module: cssnext,
      options: {
          browsers: ['> 1%'],
          warnForDuplicates: false
      }
    },
    {
      module: cssnano,
      options: {
          safe: true,
          sourcemap: true
      }
    }
  ]
};


module.exports = function(defaults) {
  
  let sourceDir = 'src';
  let appTree = new Angular2App(defaults, {
      sourceDir: sourceDir,
      sassCompiler: {
        includePaths: [
          'src/style'
        ]
      },
      vendorNpmFiles: [
        'systemjs/dist/system-polyfills.js',
        'systemjs/dist/system.src.js',
        'zone.js/dist/*.js',
        'es6-shim/es6-shim.js',
        'reflect-metadata/*.js',
        'reflect-metadata/*.js.map',
        'rxjs/**/*.js',
        'rxjs/**/*.js.map',
        '@angular/**/*.js',
        '@angular/**/*.js.map',
        'd3/d3.js',
        'three/build/three.js',
        'three/examples/js/postprocessing/*.js',
        'three/examples/js/shaders/*.js'
      ]
    });
    
    
    let sass = mergeTrees(_.map(glob.sync('src/**/*.scss'), function(sassFile) {
        sassFile = sassFile.replace('src/', '');
        return compileSass(['src'], sassFile, sassFile.replace(/.scss$/, '.css'));
    }));
    
    let css = compileCSS(sass, options);

    return mergeTrees([appTree, sass, css], { overwrite: true });
};