// Load plugins
import gulp         from 'gulp';
import autoprefixer from 'autoprefixer';
import browserSync  from 'browser-sync';
import changed      from 'gulp-changed';
import concat       from 'gulp-concat';
import duration     from 'gulp-duration';
import ghpages      from 'gulp-gh-pages';
import less         from 'gulp-less';
import minifycss    from 'gulp-minify-css';
import uglify       from 'gulp-uglify';

const reload = browserSync.reload;

const paths =  {
  'html': {
    'src_files': 'dist/*.html'
  },
  'js': {
    'src_files': 'src/js/*.js',
    'dist_dir':  'dist/js/'
  },
  'styles': {
    'src_files': 'src/less/app.less',
    'dist_dir':  'dist/css/'
  }
};


gulp.task('html', function() {
  return gulp.src([paths.html.src_files])
    .pipe(reload({stream:true}));
});

gulp.task('js', function() {
  return gulp.src([paths.js.src_files])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dist_dir))
    .pipe(duration('building js'))
    .pipe(reload({stream:true}));
});

gulp.task('styles', function() {
  return gulp.src([paths.styles.src_files])
    .pipe(less({ compress: true }))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.styles.dist_dir))
    .pipe(duration('building styles'))
    .pipe(reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch(paths.styles.src_files, ['styles']);
  gulp.watch(paths.js.src_files, ['js']);
  gulp.watch(paths.html.src_files, ['html']);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'dist/'
    },
    notify: false
  });
});

gulp.task('website', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});

gulp.task('default', ['js','styles']);

gulp.task('serve', ['default','watch','browser-sync'], () => {
    gulp.watch([paths.html.src_files], reload);
});
