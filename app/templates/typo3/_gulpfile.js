/* ========================================
 * Gulpfile for `<%= appNameHumanize %>`
 * ========================================
 *
 * @generated <%= (generatorDate) %> using `<%= pkg.name %> v<%= pkg.version %>`
 * @url <%= (generatorRepository) %>
 */

'use strict';

var fs = require('fs');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var merge = require('merge-stream');
var notifier = require('node-notifier');
var path = require('path');
var prettyHrtime = require('pretty-hrtime');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var through = require('through2');
var watchify = require('watchify');
var $ = require('gulp-load-plugins')();

var production = false;
var host = process.env.npm_config_host;
var open = process.env.npm_config_open;


/* ======
 * Config
 * ====== */

var config = {
  host: '<%= appNameDasherize %>.dev',
  src: '<%= appRoot %>/Resources/Private/',
  dest: '<%= appRoot %>/Resources/Public/',
  stylesheets: {
    src: '<%= appRoot %>/Assets/stylesheets/app.scss',
    dest: '<%= appRoot %>/Resources/Public/Assets/stylesheets/',
    watch: '<%= appRoot %>/Assets/stylesheets/**/*.scss'
  },
  javascripts: {
    src: '<%= appRoot %>/Assets/javascripts/',
    dest: '<%= appRoot %>/Resources/Public/Assets/javascripts/',
    bundle: [{
      src: '<%= appRoot %>/Assets/javascripts/app.js',
      file_name: 'app.js'
    }, {
      src: '<%= appRoot %>/Assets/javascripts/head.js',
      file_name: 'head.js'
    }]
  },
  images: {
    src: '<%= appRoot %>/Assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
    dest: '<%= appRoot %>/Resources/Public/Assets/images/',
    watch: '<%= appRoot %>/Assets/images/*.{jpg,jpeg,png,gif,webp,svg}'
  },
  fonts: {
    src: '<%= appRoot %>/Assets/fonts/*.{eot,svg,ttf,woff}',
    dest: '<%= appRoot %>/Resources/Public/Assets/fonts/',
    watch: '<%= appRoot %>/Assets/fonts/*.{eot,svg,ttf,woff}'
  }
}


/* ======
 * Tasks
 * ====== */

/**
 * Stylesheets
 */
gulp.task('stylesheets', function() {
  var pipeline = gulp.src(config.stylesheets.src)
    .pipe($.sass({
      includePaths: ['node_modules', 'bower_components'],
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .on('error', $.sass.logError)
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'IE 10', 'Safari >= 8']
    }));

  if (production) {
    pipeline = pipeline
      .pipe($.replace('../', '/typo3conf/ext/' + config.dest + 'Assets/'))
      .pipe($.combineMq({ beautify: false }))
      .pipe($.cssnano({ mergeRules: false }))
      .pipe(gulp.dest(config.stylesheets.dest));
  } else {
    return pipeline = pipeline
      .pipe(gulp.dest(config.stylesheets.dest))
      .pipe(browserSync.stream());
  }
});

/**
 * Javascripts
 */
gulp.task('javascripts', function(callback) {

  var bundleQueue = config.javascripts.bundle.length;

  var browserifyBundle = function(bundleConfig) {

    var pipeline = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      entries: bundleConfig.src,
      debug: !production
    });

    var bundle = function() {
      bundleLogger.start(bundleConfig.file_name);

      var collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(bundleConfig.file_name));

      if (!production) {
        collect = collect.pipe(browserSync.stream())
      }

      return collect
        .pipe(gulp.dest(config.javascripts.dest))
        .on('end', reportFinished);
    };

    if (!production) {
      pipeline = watchify(pipeline).on('update', bundle);
    }

    var reportFinished = function() {
      bundleLogger.end(bundleConfig.file_name)

      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          callback();
        }
      }
    };

    return bundle();
  };

  config.javascripts.bundle.forEach(browserifyBundle);
});

/**
 * Images
 */
gulp.task('images', function() {
  var pipeline = gulp.src(config.images.src)
    .pipe($.changed(config.images.dest))
    .pipe($.imagemin())
    .on('error', handleError)
    .pipe(gulp.dest(config.images.dest));

  if (production) {
    return pipeline;
  }

  return pipeline.pipe(browserSync.stream());
});

/**
 * Fonts
 */
gulp.task('fonts', function() {
  var pipeline = gulp.src(config.fonts.src)
    .pipe($.changed(config.fonts.dest))
    .on('error', handleError)
    .pipe(gulp.dest(config.fonts.dest));

  if (production) {
    return pipeline;
  }

  return pipeline.pipe(browserSync.stream());
});

/**
 * Server
 */
gulp.task('server', function() {
  browserSync.init({
    open: open === undefined ? 'external' : open,
    port: 9001,
    proxy: host ? host : config.host,
    notify: false,
    serveStatic: ['./']
  });
});

/**
 * Watch
 */
gulp.task('watch', function(callback) {
  gulp.watch(config.src + '**/*.html').on('change', browserSync.reload);
  gulp.watch(config.stylesheets.watch, ['stylesheets']);
  gulp.watch(config.fonts.watch, ['fonts']);
  gulp.watch(config.images.watch, ['images']);
  gulp.watch('gulpfile.js', ['default']);
});

/**
 * Copy necessary assets
 */
gulp.task('copyAssets', function() {
  return gulp.src('node_modules/jquery/dist/jquery.js')
    .pipe(gulp.dest(config.javascripts.dest + 'vendors/'))
});

/**
 * JavasScript Coding style
 */
gulp.task('jscs', function() {
  return gulp.src(config.javascripts.src + '**/*.js')
    .pipe($.jscs());
});

/**
 * Modernizr
 */
gulp.task('modernizr', ['stylesheets'], function() {
  return gulp.src([
    config.javascripts.src + '**/*.js',
    config.stylesheets.dest + 'app.css'
  ])
    .pipe($.modernizr({
      excludeTests: ['hidden'],
      tests: [''],
      options: [
        'setClasses',
        'addTest',
        'html5printshiv',
        'testProp',
        'fnBind',
        'prefixed'
      ]
    }))
    .on('error', handleError)
    .pipe(gulp.dest(config.javascripts.dest));
});

/**
 * Concat and minify JavaScripts
 */
gulp.task('minifyScripts', ['modernizr', 'javascripts'], function() {
  var headScripts = gulp.src([
    config.javascripts.dest + 'modernizr.js',
    config.javascripts.dest + 'head.js'
  ])
    .pipe($.concat('head.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.javascripts.dest));

  var bottomScripts = gulp.src([
    'bower_components/jquery/dist/jquery.js',
    config.javascripts.dest + 'app.js'
  ])
    .pipe($.concat('app.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(config.javascripts.dest));

  return merge(headScripts, bottomScripts);
});

/**
 * Tasks
 */
var tasks = ['stylesheets', 'javascripts', 'images', 'fonts'];

/**
 * Create dist files and inline <head> css/js
 */
gulp.task('createDistPartials', tasks.concat(['minifyScripts']), function() {
  return gulp.src([
    config.src + 'Partials/Top.html',
    config.src + 'Partials/Bottom.html',
  ], { base: config.src })
    .pipe($.replace(inline({ matchFile: 'app.css' }), function() {
      return inline({ file: 'app.css' });
    }))
    .pipe($.replace(inline({ matchFile: 'head.js' }), function() {
      return inline({ file: 'head.js' });
    }))
    .pipe($.rename({ suffix: '.dist' }))
    .pipe(gulp.dest(config.src));
});

/**
 * Revision
 */
gulp.task('rev', tasks.concat(['createDistPartials']), function() {
  rimraf.sync(config.stylesheets.dest);
  rimraf.sync(config.javascripts.dest + 'head.js');
  rimraf.sync(config.javascripts.dest + 'modernizr.js');

  return gulp.src([
    config.dest + 'Assets/{images,fonts,javascripts}/**'
  ])
    .pipe($.rev())
    .pipe(gulp.dest(config.dest + 'Assets/'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(gulp.dest('./'));
});

/**
 * Update references
 */
gulp.task('updateReferences', tasks.concat(['rev']), function() {
  var manifest = gulp.src('./rev-manifest.json');

  return gulp.src([
    config.dest + 'Assets/**',
    config.src + 'Partials/Top.dist.html',
    config.src + 'Partials/Bottom.dist.html'
  ], { base: config.dest })
    .pipe($.revReplace({
      manifest: manifest,
      replaceInExtensions: ['.js', '.css', '.html']
    }))
    .pipe(gulp.dest(config.dest));
});


/* ======
 * Main collected tasks
 * ====== */

gulp.task('build', ['jscs'], function() {
  rimraf.sync(config.dest);
  production = true;
  gulp.start(tasks.concat([
    'modernizr',
    'minifyScripts',
    'createDistPartials',
    'rev',
    'updateReferences'
  ]));
});

gulp.task('default', ['build']);

gulp.task('dev', tasks.concat([
  'copyAssets',
  'modernizr',
  'watch',
  'server'
]));


/* ======
 * Utilities
 * ====== */

function handleError(err) {
  $.util.log(err);
  $.util.beep();
  notifier.notify({
    title: 'Compile Error',
    message: err.message
  });
  return this.emit('end');
}

function inline(opts) {
  opts = opts || {};

  if (opts.matchFile) {
    if (opts.matchFile.match(/.js/)) {
      return new RegExp('<v:asset.script(.*?)path="(.*?)'+opts.matchFile+'"(.*?)>');
    }
    return new RegExp('<v:asset.style(.*?)path="(.*?)'+opts.matchFile+'"(.*?)>');
  }

  if (opts.file) {
    var content;
    var tagBegin = '<v:asset.script standalone="true" allowMoveToFooter="false">';
    var tagEnd = '</v:asset.script>';

    if (opts.file.match(/.js/)) {
      content = fs.readFileSync(config.javascripts.dest + opts.file, 'utf8');
    } else {
      tagBegin = '<v:asset.style standalone="true">';
      tagEnd = '</v:asset.style>';
      content = fs.readFileSync(config.stylesheets.dest + opts.file, 'utf8');
    }

    return tagBegin + content + tagEnd;
  }
}

var startTime, bundleLogger = {
  start: function(filepath) {
    startTime = process.hrtime();
    $.util.log('Bundling', $.util.colors.green(filepath));
  },
  end: function(filepath) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    $.util.log('Bundled', $.util.colors.green(filepath), 'after', $.util.colors.magenta(prettyTime));
  }
}

function rmOriginalFiles() {
  return through.obj(function(file, enc, cb) {

    if (file.revOrigPath) {
      fs.unlink(file.revOrigPath);
    }

    this.push(file);
    return cb();
  });
}

