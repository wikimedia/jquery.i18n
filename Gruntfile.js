/*!
 * Grunt file
 *
 * @package jquery.i18n
 */
'use strict';
/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		connect: {
			server: {
				options: {
					port: 9001,
					base: '.'
				}
			}
		},
		jshint: {
			options: JSON.parse( grunt.file.read( '.jshintrc' )
				.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\//g, '' ).replace( /\/\/[^\n\r]*/g, '' ) ),
			all: [ 'src/**/*.js' ]
		},
		watch: {
			files: [
				'.{jshintignore,jshintrc}',
				'Gruntfile.js',
				'<%= jshint.all %>'
			],
			tasks: 'test'
		},
		qunit: {
			all: {
				options: {
					urls: [ 'http://localhost:<%=connect.server.options.port%>/test/index.html' ]
				}
			}
		}
	} );

	grunt.registerTask( 'server', [ 'connect' ] );
	grunt.registerTask( 'lint', [ 'jshint' ] );
	grunt.registerTask( 'unit', [ 'server', 'qunit' ] );
	grunt.registerTask( 'test', [ 'lint', 'unit' ] );
	grunt.registerTask( 'default', [ 'test' ] );
};
