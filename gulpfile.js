var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var sass = require('gulp-sass');

function compile(watch) {
  var bundler = watchify(browserify('./src/js/app.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/js'));
    gulp.src('./src/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./build/css'));
    gulp.src('./src/index.html')
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('html', function () {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
});

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('default', ['html', 'sass', 'build']);
