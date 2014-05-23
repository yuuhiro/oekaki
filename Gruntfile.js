module.exports = function(grunt) {

	BUILD_ORDERED_LIST_JS  = [
		'source/js/vendor/lodash-2.4.1.js',
		'source/js/vendor/jquery-2.1.1.js',
		'source/js/vendor/backbone-1.1.2.js',
		'source/js/app.js'
	];

	grunt.initConfig({

		pkg: grunt.file.readJSON("package.json"),

		watch: {
			all: {
				files: [
					"source/sass/*.scss",
					"source/sass/*/*.scss",
					"source/js/*.js",
					"source/js/*/*.js"
				],
				tasks: ["compass", "concat"]
			},
		},
		
		compass: {
			all: {
				options: {
					sassDir: 'source/sass/',
					cssDir: 'build/static/css/',
					imagesDir: "build/static/images/",
					httpGeneratedImagesPath: '../images/',
					noLineComments: true
				}
			}
		},

		concat: {
			js: {
				src: BUILD_ORDERED_LIST_JS,
				dest: 'build/static/js/all.js'
			},
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-compass");
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask("default", ["compass", "concat", "watch"]);
};