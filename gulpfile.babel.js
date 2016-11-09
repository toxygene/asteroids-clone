"use strict";

import babelify from 'babelify';
import browserify from 'browserify';
import gulp from 'gulp';
import gutil from 'gulp-util';
import mocha from 'gulp-mocha';
import rename from 'gulp-rename';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

gulp.task('tests', () => {
    gulp
        .src('./tests/**/*.js')
        .pipe(mocha());
});

gulp.task('default', () => {
    let bundle = (bundler) => {
        gutil.log(gutil.colors.green('==> Starting bundle!'));

        bundler
            .bundle()
            .on('error', error => { gutil.log(gutil.colors.red('Browserify error: ', error)); })
            .on('end', () => gutil.log(gutil.colors.green('==> Successful bundle!')))
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./dist'));
    }

    let bundler = browserify('./src/app.js', {debug: true})
        .plugin(watchify)
        .transform(babelify, {presets: ['es2015']});

    bundle(bundler);

    bundler.on('update', () => bundle(bundler));
});
