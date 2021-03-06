var gulp = require('gulp');
var shell = require('gulp-shell');
var merge = require('merge-stream');

module.exports = function () {
    return function () {
        var imgs = gulp.src(['images/**/*']).pipe(gulp.dest('./dist/images'));
        var fonts = gulp.src(['fonts/**/*']).pipe(gulp.dest('./dist/engine'));
        var js = gulp.src(['js/**/*']).pipe(gulp.dest('./dist/js'));
        var ghFiles = gulp.src(['CNAME', 'favicon.ico']).pipe(gulp.dest('./dist/'));

        return merge(imgs, fonts, ghFiles, js);
    };
};
