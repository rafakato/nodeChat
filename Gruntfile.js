module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bowercopy: {
            options: {
                runBower: true
            },
            angular: {
                options: {
                    destPrefix: "public/javascripts/lib/angular"
                },
                files: {
                    "angular.js": "angular/angular.js"
                },
            },
            angularcss: {
                options: {
                    destPrefix: "public/stylesheets/lib/angular"
                },
                files: {
                    "angular-csp.css": "angular/angular-csp.css"
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
        },
        express: {
            options: {
                port: 3000,
                args: ["--socket_port=3010"],
                node_env: 'development'
            },
            dev: {
                options: {
                    script: './app.js'
                }
            },
            prod: {
                options: {
                    script: './app.js',
                    node_env: 'production'
                    //port: 80
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    './public/stylesheets/index.css': './public/stylesheets/pages/index.scss',
                    './public/stylesheets/buy.css': './public/stylesheets/pages/buy.scss',
                    './public/stylesheets/operator.css': './public/stylesheets/pages/operator.scss',
                    './public/stylesheets/client.css': './public/stylesheets/pages/client.scss'
                }
            },
            dist_min: {
                options: {
                    style: 'compressed'
                },
                files: {
                    './public/stylesheets/index.min.css': './public/stylesheets/pages/index.scss',
                    './public/stylesheets/buy.min.css': './public/stylesheets/pages/buy.scss',
                    './public/stylesheets/operator.min.css': './public/stylesheets/pages/operator.scss',
                    './public/stylesheets/client.min.css': './public/stylesheets/pages/client.scss'
                }
            }
        },
        watch: {
            express: {
                files: ['./app.js', './routes/*.js', './socket/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['./public/stylesheets/pages/**/*.scss', './public/stylesheets/pages/**/*.sass'],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            }
        }
    });

    var target = grunt.option('target') || 'dev';

    grunt.loadNpmTasks("grunt-bowercopy");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask("default", ["bowercopy"]);

    grunt.registerTask("server", ["express:" + target, "sass", "watch"]);

    grunt.registerTask("r.js", ["requirejs"]);
};