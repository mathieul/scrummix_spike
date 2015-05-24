exports.config =
  bower: false
  files:
    javascripts:
      joinTo:
        'js/app.js':         /^web\/static/
        'js/vendor.js':      /^bower_components\/(jquery|babel-polyfill|node-uuid|immutable|react|reflux|semantic-ui)/
        'js/test.js':        /^test\/static\/specs/
        'js/test-vendor.js': /^bower_components\/(mocha|chai|sinon|sinon-chai)/

    stylesheets:
      joinTo:
        'css/app.css': /^(web\/static\/css|bower_components|vendor)/

    templates:
      joinTo: 'js/app.js'

  # Phoenix paths configuration
  paths:
    # Which directories to watch
    watched: ["web/static", "test/static"]

    # Where to compile files to
    public: "priv/static"

  modules:
    nameCleaner: (path) ->
      if path.indexOf('web/static/js') is 0
        path.replace(/^web\/static\/js/, 'scrummix')
      else if path.indexOf('test/static/specs') is 0
        path.replace(/^test\/static\/specs/, 'test')
      else
        path

  # Configure your plugins
  plugins:
    babel:
      ignore: [/^(web\/static\/vendor|bower_components)/]
      resolveModuleSource: (source, filename) -> source

    jshint:
      pattern: /^web\/static\/.*[^j][^s][^x].js$/
      options:
        esnext: true
      warnOnly: true
