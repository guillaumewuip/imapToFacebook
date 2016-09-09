
const
    gulp        = require('gulp'),
    exec        = require('child_process').exec,
    eslint      = require('gulp-eslint');

const inputPaths = {
    javascript: [
        '.eslintrc.json',
        'gulpfile.js',
        'index.js',
        'test/**/*.js',
    ],
};

/**
 * JS
 */

gulp.task('js:lint', () => {
    // http://eslint.org/docs/rules
    let task = gulp
        .src(inputPaths.javascript)
        .pipe(eslint())
        .pipe(eslint.format());

    if (process.env.CI) {
        task = task.pipe(eslint.failAfterError());
    }

    return task;
});

gulp.task('js:watch', () => {
    gulp.watch(inputPaths.javascript, [
        'js:lint',
        'js:test',
    ]);
});

gulp.task('js:test', (done) => {
    const cmd = [
        'mocha',
        '--colors',
        '--reporter list',
        '\'test/**/*.js\'',
    ];
    exec(cmd.join(' '), (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done();
    });
});

/**
 * Main tasks
 */

gulp.task('watch', ['js:watch']);
gulp.task('dev', ['js:lint', 'js:test']);
gulp.task('default', ['dev', 'watch']);

