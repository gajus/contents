module.exports = function(config) {
    config.set({
        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },
        basePath: '',
        frameworks: [
            'mocha',
            'chai'
        ],
        files: [
            'node_modules/jquery/dist/jquery.js',
            'dist/browser/contents.js',
            'tests/*.js',
            'tests/fixture/*.html'
        ],
        preprocessors: {
            'tests/**/*.js': [
                'babel'
            ],
            'tests/fixture/*.html': [
                'html2js'
            ]
        },
        reporters: [
            'progress'
        ],
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            'PhantomJS'
        ],
        singleRun: false
    });
};
