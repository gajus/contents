var karma = require('karma').server,
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jsonfile = require('jsonfile'),
    Gitdown = require('gitdown');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('version', ['lint'], function () {
    var name = 'contents',
        pkg = jsonfile.readFileSync('./package.json'),
        bower = jsonfile.readFileSync('./bower.json');

    gulp
        .src('./dist/' + name + '.js')
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename(name + '.min.js'))
        .pipe(gulp.dest('./dist/'));

    bower.name = pkg.name;
    bower.description = pkg.description;
    bower.keywords = pkg.keywords;
    bower.license = pkg.license;
    bower.authors = [pkg.author];

    jsonfile.writeFileSync('./bower.json', bower);
});

gulp.task('gitdown', function () {
    var gitdown;

    gitdown = Gitdown.read('.gitdown/README.md');

    return gitdown.write('README.md');
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './package.json'], ['default']);
    gulp.watch('./.gitdown/*', ['gitdown']);
});

gulp.task('test', ['default'], function (cb) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('default', ['version']);
