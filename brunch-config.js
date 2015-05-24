exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js':    /^web\/static/,
        'js/vendor.js': [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/babel-polyfill/browser-polyfill.js',
          'bower_components/node-uuid/uuid.js',
          'bower_components/immutable/dist/immutable.js',
          'bower_components/react/react-with-addons.js',
          'bower_components/reflux/dist/reflux.js',
          'bower_components/semantic-ui/dist/semantic.js'
        ],
        'js/test.js': /^test\/static/,
        'js/test-vendor.js': [
          'bower_components/mocha/mocha.js',
          'bower_components/chai/chai.js',
          'bower_components/sinon/lib/sinon.js',
          'bower_components/sinon-chai/lib/sinon-chai.js'
        ]
      }
    },
    stylesheets: {
      joinTo: {
        'css/app.css': /^(web\/static\/css|bower_components|vendor)/
      }
    },
    templates: {
      joinTo: 'js/app.js'
    }
  },

  // Phoenix paths configuration
  paths: {
    // Which directories to watch
    watched: ["web/static", "test/static"],

    // Where to compile files to
    public: "priv/static"
  },

  modules: {
    nameCleaner: function (path) {
      if (path.indexOf('web/static/js') === 0) {
        return path.replace(/^web\/static\/js/, 'scrummix');
      } else if (path.indexOf('test/static/specs') === 0) {
        return path.replace(/^test\/static\/specs/, 'test');
      } else {
        return path;
      }
    }
  },

  // Configure your plugins
  plugins: {
    babel: {
      ignore: [/^(web\/static\/vendor|bower_components)/],
      resolveModuleSource: function (source, filename) {
        return source;
      }
    },
    jshint: {
      pattern: /^web\/static\/.*[^j][^s][^x].js$/,
      options: {
        esnext: true
      },
      warnOnly: true
    }
  }
};
