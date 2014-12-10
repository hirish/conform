gulp       = require 'gulp'
browserify = require 'gulp-browserify'
rename     = require 'gulp-rename'
plumber    = require 'gulp-plumber'

gulp.task 'compile', ->
  gulp.src './src/conform.coffee', read: false
    .pipe browserify
      transform: ['coffee-reactify']
      standalone: 'Conform'
    .pipe rename 'conform.js'
    .pipe gulp.dest('./')
  gulp.src './src/demo.cjsx', read: false
    .pipe browserify
      transform: ['coffee-reactify']
      standalone: 'Demo'
    .pipe rename 'demo.js'
    .pipe gulp.dest('./')

gulp.task 'watch', ->
  gulp.watch './src/**/*', ['compile']

gulp.task 'default', ['compile', 'watch']
