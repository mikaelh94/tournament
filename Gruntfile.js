module.exports = function(grunt) {
    'use strict';

    require('matchdep').filterDev('grunt-!(cli)').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        less: {
            dev: {
                options: {
                    compress: true
                },
                files: {
                    'public/css/style.css': 'public/less/style.less'
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'public/modules/app.js',
                    'public/modules/**/*.module.js',
                    'public/modules/**/*.js'

                ],
                dest: 'public/js/script.js',
            },
        },
        watch: {
            all: {
                files: [
                    'public/less/**/*.less',
                    'public/modules/**/*.js'
                ],
                tasks: ['less', 'concat', 'notify:less'],
                options: {
                    nospawn: true
                }
            },
            livereload: {
                files: ['public/css/style.css'],
                options: {
                    livereload: true,
                    nospawn: true
                }
            }
        },
        notify: {
            less: {
                options: {
                    message: 'Less compiled',
                }
            }
        },
        wiredep: {

            task: {

                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'views/index.ejs'   // .html support...
                ],

                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'concat', 'watch']);
    grunt.registerTask('lib', ['wiredep']);
};