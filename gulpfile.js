'use strict';

const gulp = require('gulp');
const browswerSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const rimraf = require('gulp-rimraf');

gulp.task('default', ['sass'],()=> {
  browswerSync.init({
    server: {
      baseDir: './src/'
    }
  });

  gulp.watch('src/css/**/*.scss', ['sass']);
  gulp.watch('src/img/*', ['imgmin']);
  gulp.watch(['src/*.html', 'src/js/**/*.js']).on('change', browswerSync.reload);
});

gulp.task('sass', () => {
  return gulp.src('src/css/**/*.scss')
          .pipe(plumber())
          .pipe(sass({ outputStyle: 'compressed' }))
          .pipe(gulp.dest('src/css'))
          .pipe(browswerSync.stream());
});

gulp.task('imgmin', () => {
  return gulp.src('src/img/*')
         .pipe(imagemin({ optimizationLevel: 5, verbose: true }))
         .pipe(gulp.dest('src/img'))
         .pipe(browswerSync.stream());
});

gulp.task('clean', () => {
  return gulp.src('dist/*', { read: false }).pipe(rimraf());
});

gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
         .pipe(uglify())
         .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['clean', 'imgmin', 'sass', 'js'], () => {
  return gulp.src(['!src/css/**/*.scss', 'src/**/*'])
    .pipe(gulp.dest('dist'));
});
