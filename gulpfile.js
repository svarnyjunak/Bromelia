var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    livereload = require('gulp-livereload'),
    cssFilter = ['css/**/*.css', '!css/**/*.min.css'];

gulp.task('styles', function() {
  return gulp.src(cssFilter)
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('css/'))
    .pipe(notify({ message: 'Styles minification complete' }));
});

gulp.task('images', function() {
  var imageMinOptions = { optimizationLevel: 3, progressive: true, interlaced: true };
  return gulp.src('images/wallpaper.jpg')
    .pipe(imagemin(imageMinOptions))
    .pipe(gulp.dest('images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('default', function() {
    gulp.start('styles', 'images');
});

gulp.task('watch', function() {
    gulp.watch(cssFilter, ['styles']);
    livereload.listen();
    gulp.watch(['css/**']).on('change', livereload.changed);
});