module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bowercopy: {
            angular: {
                options: {
                    destPrefix: "public/javascripts/lib/angular"
                },
                files: {
                    "angular.js": "angular/angular.js"
                },
            },
            momentjs: {
                options: {
                    destPrefix: "public/javascripts/lib/momentjs"
                },
                files: {
                    "moment.js": "momentjs/moment.js",
                    "lang": "momentjs/lang/*.js"
                },
            },
            "socket.io": {
                options: {
                    destPrefix: "public/javascripts/lib/socket.io"
                },
                files: {
                    "": "socket.io-client/dist/*.*"
                },
            },
            underscore: {
                options: {
                    destPrefix: "public/javascripts/lib/underscore"
                },
                files: {
                    "underscore.js": "underscore/underscore.js"
                },
            },
            requirejs: {
                options: {
                    destPrefix: "public/javascripts/"
                },
                files: {
                    "require.js": "requirejs/require.js"
                },
            },
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'public/javascripts/',
                    mainConfigFile: 'public/javascripts/require.config.js',
                    optimize: "uglify2",
                    skipDirOptimize: true,
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    dir: 'public/javascripts/build',
                    modules: [{
                        name: './index',
                        include: ['angular', 'socket.io'],
                        exclude: ['../require.config']
                    }, {
                        name: './operator',
                        include: ['angular', 'socket.io', 'underscore'],
                        exclude: ['../require.config']
                    }, {
                        name: './client',
                        include: ['angular', 'socket.io', 'underscore'],
                        exclude: ['../require.config']
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-bowercopy");
    grunt.loadNpmTasks("grunt-contrib-requirejs");

    grunt.registerTask("default", ["bowercopy"]);

    grunt.registerTask("r.js", ["requirejs"]);
};