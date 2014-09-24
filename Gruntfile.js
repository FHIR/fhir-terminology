module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-webpack');

  var buildDir = process.env.PREFIX || './dist/';

  grunt.initConfig({
    clean: {
      options: { force: true },
      main: [buildDir + '**/*']
    },
    webpack: {
      app: {
        entry: "./src/coffee/app.coffee",
        output: {
          path: buildDir + '/js/',
          filename: "main.js",
          library: "fhirface"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]},
        resolve: {
          extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
        }
      }
    },
    ngtemplates: {
      app: {
        src: 'src/views/**/*.html',
        dest: buildDir + 'js/views.js',
        options: {
          module: 'fhirface',
          prefix: '/'
        }
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/less',
          src: ['*.less', '!.*#.less'],
          dest: buildDir + 'css/',
          ext: '.css'
        }]
      }
    },
    concat: {
      lib_js: {
        src: [
          "lib/jquery/dist/jquery.min.js",
          "lib/angular/angular.js",
          "lib/angular-formstamp/build/formstamp.js",
          "lib/angular-route/angular-route.js",
          "lib/angular-animate/angular-animate.js",
          "lib/angular-cookies/angular-cookies.js",
          "lib/angular-sanitize/angular-sanitize.js",
          "lib/codemirror/lib/codemirror.js",
          "lib/codemirror/mode/sql/sql.js",
          "lib/codemirror/mode/javascript/javascript.js",
          "lib/angular-ui-codemirror/ui-codemirror.js",
          "lib/ng-fhir/ng-fhir.js"
        ],
        dest: buildDir + 'js/lib.js'
      },
      app_js: {
        src: [ buildDir + 'js/main.js', buildDir + 'js/views.js' ],
        dest: buildDir + 'js/app.js'
      },
      lib_css: {
        src: [
        'lib/components-font-awesome/css/font-awesome.min.css',
        'lib/codemirror/lib/codemirror.css',
        'lib/bootstrap/dist/css/bootstrap.min.css',
        "lib/angular-formstamp/build/formstamp.css"
        ],
        dest: buildDir + 'css/lib.css'
      }
    },
    copy: {
      bs_fonts: {
        cwd: 'lib/bootstrap/dist/fonts/',
        expand: true,
        src: '*',
        dest: buildDir + 'fonts/'
      },
      fa_fonts: {
        cwd: 'lib/components-font-awesome/fonts/',
        expand: true,
        src: '*',
        dest: buildDir + 'fonts/'
      },
      hs_fonts: {
        cwd: 'fonts/',
        expand: true,
        src: '*',
        dest: buildDir + 'fonts/'
     },
     img: {
        cwd: 'src/imgs/',
        expand: true,
        src: '*',
        dest: buildDir + 'imgs/'
     },
     vss: {
        cwd: 'valuesets/',
        expand: true,
        src: '*',
        dest: buildDir + 'valuesets/'
     },
     index: {
       src: 'src/index.html',
       dest: buildDir + 'index.html'
     }
    },
    watch: {
      main: {
        files: ['src/**/*'],
        tasks: ['build'],
        options: {
          events: ['changed', 'added'],
          nospawn: true
        }
      }
    },
    express: {
      server: {
        options: {
          port: 8080,
          bases: ['dist']
        }
      }
    }
  });

  grunt.registerTask('build', ['clean', 'webpack', 'less', 'ngtemplates', 'concat', 'copy']);
  grunt.registerTask('srv', ['express', 'express-keepalive']);
};
