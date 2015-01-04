module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: 8000,
					base: {
						path: './',
						options: {
							index: 'index.html',
							maxAge: 300000
						}
					},
					keepalive: true
				}
			}
		},
		open: {
			dev: {
				path: 'http://127.0.0.1:8000',
				app: 'Google Chrome'
			}
		}
	});

	// Default task(s).
	grunt.registerTask('default', ['open', 'connect']);
};