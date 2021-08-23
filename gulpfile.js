const gulp = require('gulp')
const pug = require('gulp-pug')
const browserSync = require('browser-sync')

function convertTemplate () {
    return gulp
        .src('./*pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
}

function syncBrowser () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        browser: "firefox"
    })
}

function watchFiles () {
    syncBrowser()
    gulp.watch('./*.pug', convertTemplate)
    gulp.watch('./css/*.css').on('change', browserSync.reload)
    gulp.watch('./js/*.js').on('change', browserSync.reload)
    gulp.watch('./*.html').on('change', browserSync.reload)
}

gulp.task('sync', gulp.parallel(watchFiles))