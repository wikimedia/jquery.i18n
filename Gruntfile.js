/*!
 * Grunt file
 *
 * @package jquery.i18n
 */
'use strict';

/* eslint-env node */

module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.initConfig( {
		connect: {
			server: {
				options: {
					port: 9001,
					base: '.'
				}
			}
		},
		watch: {
			files: [
				'*.js',
				'src/**/*.js',
				'test/**/*.js'
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
	grunt.registerTask( 'unit', [ 'server', 'qunit' ] );
	grunt.registerTask( 'test', [ 'unit' ] );
	grunt.registerTask( 'default', [ 'test' ] );
};
