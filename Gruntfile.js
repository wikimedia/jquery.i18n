/* !
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
	grunt.loadNpmTasks( 'grunt-eslint' );

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
		eslint: {
			fix: {
				options: {
					fix: true
				},
				src: [ '*.js', 'src/**/*.js' ]
			},
			all: [ '*.js', 'src/**/*.js' ]
		},
		watch: {
			files: [
				'.{eslintignore,eslintrc}',
				'<%= eslint.all %>'
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
	grunt.registerTask( 'lint', [ 'eslint' ] );
	grunt.registerTask( 'fix', [ 'eslint:fix' ] );
	grunt.registerTask( 'unit', [ 'server', 'qunit' ] );
	grunt.registerTask( 'test', [ 'lint', 'unit' ] );
	grunt.registerTask( 'default', [ 'test' ] );
};
