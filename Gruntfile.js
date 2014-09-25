module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        uglify: {
            js: {
                files: {
                    'src/bootstrap-drawer.min.js': ['src/bootstrap-drawer.js']
                }
            },
            options: {
                report: 'gzip'
            }
        },
        cssmin: {
            css: {
                src: 'src/bootstrap-drawer.css',
                dest: 'src/bootstrap-drawer.min.css'
            }
        },
        watch: {
            files: ['src/bootstrap-drawer.js'],
            tasks: ['uglify', 'cssmin']
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/bootstrap-drawer.js'
            ],
            options: {
                expr: true,
                node: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
};