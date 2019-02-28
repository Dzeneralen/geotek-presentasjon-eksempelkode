module.exports = function(grunt) {
  "use strict";
  grunt.loadNpmTasks("grunt-sync");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-babel");
  var appDir = "C:/development/WebAppBuilderForArcGISGeoTek/server/apps/3";
  var stemappDir =
    "C:/development/WebAppBuilderForArcGISGeoTek/client/stemapp3d";
  grunt.initConfig({
    sync: {
      main: {
        verbose: true,
        files: [
          {
            cwd: "dist/",
            src: "**",
            dest: stemappDir
          },
          {
            cwd: "dist/",
            src: "**",
            dest: appDir
          }
        ]
      }
    },
    babel: {
      options: { sourceMap: true },
      main: {
        files: [
          {
            expand: true,
            src: [
              "widgets/*.js",
              "widgets/**/*.js",
              "widgets/**/**/*.js",
              "widgets/!**/**/nls/*.js",
              "themes/*.js",
              "themes/**/*.js",
              "themes/**/**/*.js",
              "themes/!**/**/nls/*.js"
            ],
            dest: "dist/"
          }
        ]
      }
    },
    watch: {
      main: {
        files: ["widgets/**", "themes/**"],
        tasks: ["clean", "babel", "copy", "sync"],
        options: {
          spawn: false,
          atBegin: true,
          livereload: true
        }
      }
    },
    copy: {
      main: {
        src: [
          "widgets/**/**.html",
          "widgets/**/**.json",
          "widgets/**/**.css",
          "widgets/**/images/**",
          "widgets/**/nls/**",
          "themes/**/**.html",
          "themes/**/**.json",
          "themes/**/**.css",
          "themes/**/**.png",
          "themes/**/images/**",
          "themes/**/nls/**"
        ],
        dest: "dist/",
        expand: true
      }
    },
    clean: { dist: { src: "dist/*" } }
  });
  grunt.registerTask("default", ["watch"]);
};
