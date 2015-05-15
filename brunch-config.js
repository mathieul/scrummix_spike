exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'js/app.js':    /^web\/static/,
        'js/vendor.js': /^(bower_components|vendor)/
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

  // Configure your plugins
  plugins: {
    babel: {
      ignore: [/^(web\/static\/vendor)/],
      resolveModuleSource: function (source, filename) {
        return source;
      }//,
      // jshint: {
      //   options: {
      //     esnext: true
      //   }
      // }
    }
  }
};
