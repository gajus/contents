var pkg = require('./package.json'),
    karma = require('karma').server,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    fs = require('fs'),
    del = require('del');

gulp.task('clean', ['lint'], function (cb) {
    del(['dist'], cb);
});

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('distribute', ['clean'], function (cb) {
    var bower = require('./bower.json'),
        jquery = require('./contents.jquery.json');

    gulp
        .src('./src/contents.js')
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/contents for the canonical source repository\n* @license https://github.com/gajus/contents/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename('contents.min.js'))
        .pipe(header('/**\n* @version <%= version %>\n* @link https://github.com/gajus/contents for the canonical source repository\n* @license https://github.com/gajus/contents/blob/master/LICENSE BSD 3-Clause\n*/\n', {version: pkg.version}))
        .pipe(gulp.dest('./dist/'))
        .on('error', gutil.log);

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.version = pkg.version;
    bower.keywords = pkg.keywords;

    jquery.name = pkg.name;
    jquery.description = pkg.description
    jquery.version = pkg.version;
    jquery.keywords = pkg.keywords;
    jquery.title = pkg.title;;

    fs.writeFile('./bower.json', JSON.stringify(bower, null, 4), function () {
        fs.writeFile('./contents.jquery.json', JSON.stringify(jquery, null, 4), cb);
    });
});

gulp.task('travis', ['default'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('watch', function () {
    gulp.watch('./src/contents.js', ['default']);
});

gulp.task('default', ['distribute']);