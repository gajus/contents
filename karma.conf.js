module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'bower_components/jquery/dist/jquery.js',
            'dist/*',
            'tests/*.js',
            'tests/fixture/*.html'
        ],
        exclude: [
            'dist/contents.min.js'
        ],
        preprocessors: {
            'tests/fixture/*.html': ['html2js']
        },
        reporters: [
            'progress'
        ],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};