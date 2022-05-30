const gulp = require('gulp'),
  bs = require('browser-sync'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass')(require('sass')),
  ts = require('gulp-typescript')

gulp.task('serve', () => {
  bs.init({
    server: {
      baseDir: './dist',
    },
  })
  gulp.watch('app/scss/*.scss', gulp.series('scss'))
  gulp.watch('app/pug/**/*.pug', gulp.series('pug'))
  gulp.watch('app/ts/**/*.ts', gulp.series('ts'))
  gulp.watch('dist/**/*.html').on('change', bs.reload)
})

gulp.task('scss', () => {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream())
})

gulp.task('pug', () => {
  return gulp
    .src('app/pug/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream())
})

gulp.task('ts', () => {
  return gulp
    .src('app/ts/**/*.ts')
    .pipe(
      ts({
        noImplicitAny: true,
        outFile: 'main.js',
        target: 'ESNext',
      }),
    )
    .pipe(gulp.dest('dist/js'))
    .pipe(bs.stream())
})

gulp.task('build', gulp.series('pug', 'scss', 'ts'))
gulp.task('default', gulp.series('build'))
