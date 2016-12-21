/* ========================================
 * Gruntfile for `Rebirth`
 * ========================================
 *
 * @generated 4.8.2015 using `generator-my v0.2.0`
 * @url https://bitbucket.org/mediasignal/my-web-starter-kit.git
 */

'use strict'

var assemble = require('assemble')
var app = assemble()
var fs = require('fs')
var browserify = require('browserify')
var browserSync = require('browser-sync').create()
var handlebarsHelpers = require('handlebars-helpers')()
var notifier = require('node-notifier')
var path = require('path')
var prettyHrtime = require('pretty-hrtime')
var rimraf = require('rimraf')
var source = require('vinyl-source-stream')
var through = require('through2')
var vfs = require('vinyl-fs')
var watch = require('base-watch')
var watchify = require('watchify')
var $ = require('gulp-load-plugins')()

var production = process.env.NODE_ENV === 'production'
var open = process.env.npm_config_open

/* ======
 * Config
 * ====== */

var config = {
  src: 'src/',
  dest: 'dist/',
  buildPath: '/',
  stylesheets: {
    src: 'src/assets/stylesheets/docs.scss',
    dest: 'dist/assets/stylesheets/',
    watch: 'src/assets/stylesheets/**/**/*.scss'
  },
  javascripts: {
    src: 'src/assets/javascripts/',
    dest: 'dist/assets/javascripts/',
    bundle: [{
      file_name: 'docs.js',
      src: 'src/assets/javascripts/docs.js'
    }, {
      file_name: 'docs.head.js',
      src: 'src/assets/javascripts/docs.head.js'
    }]
  },
  images: {
    src: 'src/assets/images/*.{jpg,jpeg,png,gif,webp,svg}',
    dest: 'dist/assets/images/',
    watch: 'src/assets/images/*.{jpg,jpeg,png,gif,webp,svg}'
  },
  videos: {
    src: 'src/assets/videos/*.{mp4,ogg,webm}',
    dest: 'dist/assets/videos/',
    watch: 'src/assets/videos/'
  },
  fonts: {
    src: 'src/assets/fonts/*.{eot,svg,ttf,woff,woff2}',
    dest: 'dist/assets/fonts/',
    watch: 'src/assets/fonts/*.{eot,svg,ttf,woff,woff2}'
  },
  html: {
    data: 'src/*.{json,yml}',
    dest: 'dist/',
    helpers: 'src/helpers/*.js',
    layouts: 'src/layouts/*.hbs',
    partials: 'src/partials/*.hbs',
    templates: 'src/templates/**/*.hbs',
    watch: ['src/{layouts,templates,partials}/**/*.hbs', 'src/*.{json,yml}']
  }
}

/* ======
 * Tasks
 * ====== */

/**
 * Assemble
 */
app.data({ assets: 'assets' })
app.data(config.html.data)
app.helpers(config.html.helpers)
app.helpers(handlebarsHelpers)
app.use(watch())

app.preLayout(/\/src\/templates\/.*\.hbs$/, function(view, next) {
  view.layout = 'default'
  next()
})

app.task('html', function() {
  app.data({ dev: !production })
  app.layouts(config.html.layouts)
  app.partials(config.html.partials)

  return app.src(config.html.templates)
    .pipe(app.renderFile())
    .on('error', handleError)
    .pipe($.rename({ extname: '.html' }))
    .pipe(app.dest(config.html.dest))
})

/**
 * Stylesheets
 */
app.task('stylesheets', function() {
  var pipeline = app.src(config.stylesheets.src)
    .pipe($.sass({
      includePaths: ['node_modules', 'bower_components'],
      outputStyle: 'expanded'
    }))
    .on('error', handleError)
    .on('error', $.sass.logError)
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'IE 10', 'Safari >= 8']
    }))

  if (production) {
    return pipeline = pipeline
      .pipe($.replace('../', config.buildPath + 'assets/'))
      .pipe($.combineMq({ beautify: false }))
      .pipe($.cssnano({ mergeRules: false }))
      .pipe(app.dest(config.stylesheets.dest))
  } else {
    return pipeline = pipeline
      .pipe(app.dest(config.stylesheets.dest))
      .pipe(browserSync.stream())
  }
})

/**
 * Javascripts
 */
app.task('javascripts', function(callback) {

  var bundleQueue = config.javascripts.bundle.length

  var browserifyBundle = function(bundleConfig) {

    var pipeline = browserify({
      cache: {},
      packageCache: {},
      fullPaths: false,
      entries: bundleConfig.src,
      debug: !production
    })

    var bundle = function() {
      bundleLogger.start(bundleConfig.file_name)

      var collect = pipeline
        .bundle()
        .on('error', handleError)
        .pipe(source(bundleConfig.file_name))

      if (!production) {
        collect = collect.pipe(browserSync.stream())
      } else {
        collect = collect.pipe($.streamify($.uglify()))
      }

      return collect
        .pipe(app.dest(config.javascripts.dest))
        .on('end', reportFinished)
    }

    if (!production) {
      pipeline = watchify(pipeline).on('update', bundle)
    }

    var reportFinished = function() {
      bundleLogger.end(bundleConfig.file_name)

      if (bundleQueue) {
        bundleQueue--
        if (bundleQueue === 0) {
          callback()
        }
      }
    }

    return bundle()
  }

  config.javascripts.bundle.forEach(browserifyBundle)
})

/**
 * Images
 */
app.task('images', function() {
  return app.src(config.images.src)
    .pipe($.changed(config.images.dest))
    .pipe($.imagemin({
      svgoPlugins: [
        { cleanupIDs: false },
      ],
    }))
    .on('error', handleError)
    .pipe(app.dest(config.images.dest))
})

/**
 * Videos
 */
app.task('videos', function() {
  var pipeline = vfs.src(config.videos.src)
    .pipe(vfs.dest(config.videos.dest))

  if (production) {
    return pipeline
  }

  return pipeline.pipe(browserSync.stream())
})

/**
 * Fonts
 */
app.task('fonts', function() {
  return app.src(config.fonts.src)
    .pipe($.changed(config.fonts.dest))
    .on('error', handleError)
    .pipe(app.dest(config.fonts.dest))
})

/**
 * Server
 */
app.task('server', function() {
  browserSync.init({
    open: open === undefined ? 'external' : open,
    port: 9001,
    notify: false,
    server: {
      baseDir: config.dest,
      routes: {
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules'
      }
    }
  })
})

/**
 * Watch
 */
app.task('watch', function() {
  app.watch(config.html.watch, ['html'], function(cb) {
    setTimeout(function() {
      browserSync.reload()
      cb()
    }, 150)
  })
  app.watch(config.stylesheets.watch, ['stylesheets'])
  app.watch(config.fonts.watch, ['fonts'])
  app.watch(config.images.watch, ['images'])
  app.watch(config.videos.watch, ['videos'])
})

/**
 * JavasScript Coding style
 */
app.task('eslint', function () {
  return app.src(config.javascripts.src + '**/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
})

/**
 * Modernizr
 */
app.task('modernizr', function() {
  console.log('run modernizr');
  return app.src([
    config.javascripts.src + '**/*.js',
    config.stylesheets.dest + 'docs.css'
  ])
    .pipe($.modernizr({
      excludeTests: ['hidden'],
      tests: ['objectfit'],
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
    .pipe(app.dest(config.javascripts.dest + 'vendors'))
})

/**
 * Inline <head> css/js
 */
app.task('inline', function() {
  return app.src([
    config.dest + '**/*.html'
  ], { base: config.dest })
    .pipe($.replace(inline({ matchFile: 'docs.css' }), function() {
      return inline({ file: 'docs.css' })
    }))
    .pipe($.replace(inline({ matchFile: 'docs.head.js' }), function() {
      return inline({ file: 'docs.head.js' })
    }))
    .pipe(app.dest(config.dest))
})

/**
 * Revision and remove unneeded files
 */
app.task('rev', function() {
  rimraf.sync(config.stylesheets.dest + 'vendors')
  rimraf.sync(config.javascripts.dest + 'docs.head.js')
  rimraf.sync(config.javascripts.dest + 'modernizr.js')

  return app.src([
    config.dest + 'assets/{javascripts,images,fonts}/**'
  ])
    .pipe($.rev())
    .pipe(app.dest(config.dest + 'assets/'))
    .pipe(rmOriginalFiles())
    .pipe($.rev.manifest())
    .pipe(app.dest('./'))
})

/**
 * Update references
 */
app.task('updateReferences', function() {
  var manifest = app.src('./rev-manifest.json')

  return app.src([
    config.dest + '**'
  ], { base: config.dest })
    .pipe($.revReplace({
      manifest: manifest,
      replaceInExtensions: ['.js', '.css', '.html']
    }))
    .pipe(app.dest(config.dest))
})


/* ======
 * Main collected tasks
 * ====== */

var tasks = ['stylesheets', 'modernizr', 'javascripts', 'images', 'fonts', 'videos']

app.task('build', ['eslint'], function() {
  rimraf.sync(config.dest)
  app.build(tasks.concat([
    'html',
    'inline',
    'rev',
    'updateReferences'
  ]), function(err) {
    if (err) throw err
  })
})

app.task('default', ['build'])

app.task('dev', function() {
  rimraf.sync(config.dest)
  app.build(tasks.concat(['html']), app.parallel(['server', 'watch']))
})


/* ======
 * Utilities
 * ====== */

function handleError(err) {
  $.util.log(err)
  $.util.beep()
  notifier.notify({
    title: 'Compile Error',
    message: err.message
  })
  return this.emit('end')
}

function inline(opts) {
  opts = opts || {}

  if (opts.matchFile) {
    if (opts.matchFile.match(/.js/)) {
      return new RegExp('<script(.*?)src="(.*?)' + opts.matchFile + '"(.*?)>(.*?)<\/script>')
    }

    return new RegExp('<link(.*?)href="(.*?)' + opts.matchFile + '"(.*?)>')
  }

  if (opts.file) {
    var content
    var tagBegin = '<script>'
    var tagEnd = '</script>'

    if (opts.file.match(/.js/)) {
      content = fs.readFileSync(config.javascripts.dest + opts.file, 'utf8')
    } else {
      tagBegin = '<style>'
      tagEnd = '</style>'
      content = fs.readFileSync(config.stylesheets.dest + opts.file, 'utf8')
    }

    return tagBegin + content + tagEnd
  }
}

var startTime, bundleLogger = {
  start: function(filepath) {
    startTime = process.hrtime()
    $.util.log('Bundling', $.util.colors.green(filepath))
  },
  end: function(filepath) {
    var taskTime = process.hrtime(startTime)
    var prettyTime = prettyHrtime(taskTime)
    $.util.log('Bundled', $.util.colors.green(filepath), 'after', $.util.colors.magenta(prettyTime))
  }
}

function rmOriginalFiles() {
  return through.obj(function(file, enc, cb) {

    if (file.revOrigPath) {
      fs.unlink(file.revOrigPath)
    }

    this.push(file)
    return cb()
  })
}

module.exports = app
