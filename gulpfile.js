var gulp = require('gulp'),
    gutil = require('gulp-util'),
    ftp = require('gulp-ftp'),
    cssnano = require('gulp-cssnano'),
    stylelint = require('gulp-stylelint'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    responsive = require('gulp-responsive'),
    livereload = require('gulp-livereload'),
    cssFilter = ['css/**/*.css', '!css/**/*.min.css'];

gulp.task('styles', function() {
  return gulp.src(cssFilter)
    .pipe(rename({ suffix: '.min' }))
    .pipe(stylelint({
      failAfterError: false,
      reporters: [{formatter: 'string', console: true}]
    }))
    .pipe(autoprefixer({browsers: ['> 1% in CZ']}))
    .pipe(cssnano())
    .pipe(gulp.dest('css/'))
    .pipe(notify({ message: 'Styles minification complete' }));
});

gulp.task('images', function() {
  var imageMinOptions = { optimizationLevel: 3, progressive: true, interlaced: true };
  return gulp.src('images/wallpaper.jpg')
    .pipe(imagemin(imageMinOptions))
    .pipe(gulp.dest('images'))
    .pipe(notify({ message: 'Image minimized' }))
    .pipe(responsive({
        '**/*.*': [
            {
                width: 1024,
                rename: {
                     suffix: '-1024'
                }
             },
             {
                width: 1280,
                rename: {
                     suffix: '-1280'
                }
             },
             {
                width: 1920,
                rename: {
                     suffix: '-1920'
                }
             }
         ]                 
    }))
    .pipe(imagemin(imageMinOptions))
    .pipe(gulp.dest('images'));
});

gulp.task('default', function() {
    gulp.start('styles', 'images');
});

gulp.task('watch', function() {
    gulp.watch(cssFilter, ['styles']);
    gulp.watch(['css/**']).on('change', livereload.changed);
});

gulp.task('deploy', function() {
    return gulp.src(['*.html','**/*.min.css'])
		.pipe(ftp({
			host: 'bromelia.prodejce.cz',
			user: process.env.BROMELIA_USER,
			pass: process.env.BROMELIA_PASSWORD,
		}))
		.pipe(gutil.noop());
});