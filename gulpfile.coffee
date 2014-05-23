gulp       = require 'gulp'
gutil      = require 'gulp-util'
browserify = require 'gulp-browserify'
rename     = require 'gulp-rename'
plumber    = require 'gulp-plumber'

gulp.task 'compile', ->
  gulp.src './src/conform.coffee', read: false
    .pipe browserify
      transform: ['coffeeify', 'reactify']
      extensions: ['*.coffee']
      standalone: 'Conform'
    .pipe rename 'conform.js'
    .pipe gulp.dest('./')

gulp.task 'watch', ->
  gulp.watch './src/**/*.coffee', ['compile']

gulp.task 'default', ['compile', 'watch']
