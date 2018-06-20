var gulp = require('gulp'),
    Server = require('karma').Server,
    eslint = require('gulp-eslint'),
    jsonfile = require('jsonfile');

gulp.task('lint', function () {
    return gulp
        .src(['./src/**/*.js','./tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*', './tests/**/*'], ['default']);
});

gulp.task('test', ['default'], function (done) {
    var server;

    server = new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });

    server.start(function () {
        done();
    });
});

gulp.task('default', ['lint']);
