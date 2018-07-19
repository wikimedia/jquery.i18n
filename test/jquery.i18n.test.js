( function ( $ ) {
	'use strict';

	QUnit.module( 'jquery.i18n - $.fn.i18n Tests', {
		beforeEach: function () {
			$.i18n( {
				locale: 'localex'
			} );
		},
		afterEach: function () {
			$.i18n().destroy();
		}
	} );

	QUnit.test( 'Message parse tests', function ( assert ) {
		var i18n = $( document ).data( 'i18n' ),
			$fixture = $( '#qunit-fixture' );
		// Load messages for localex
		i18n.load( {
			x: 'X'
		}, 'localex' );
		$fixture.data( 'i18n', 'x' );
		assert.strictEqual( $fixture.i18n().text(), 'X', 'Content of fixture localized' );
	} );

	QUnit.test( 'Message parse HTML', function ( assert ) {
		var i18n = $( document ).data( 'i18n' ),
			$fixture = $( '#qunit-fixture' );
		// Load messages for localex
		i18n.load( {
			x: 'X<i>Y</i>'
		}, 'localex' );
		$fixture.data( 'i18n', 'x' );
		assert.strictEqual( $fixture.i18n().html(), 'X&lt;i&gt;Y&lt;/i&gt;', 'Content of fixture localized with HTML encoded' );
		$fixture.data( 'i18n', '[html]x' );
		assert.strictEqual( $fixture.i18n().html(), 'X<i>Y</i>', 'Content of fixture localized with HTML as is' );
	} );

	QUnit.test( 'Message parse attrbutes', function ( assert ) {
		var i18n = $( document ).data( 'i18n' ),
			$fixture = $( '#qunit-fixture' );
		// Load messages for localex
		i18n.load( {
			x: 'title X'
		}, 'localex' );
		$fixture.data( 'i18n', '[title]x' );
		assert.strictEqual( $fixture.i18n().attr( 'title' ), 'title X', 'Content of title attribute localized' );
	} );

	QUnit.module( 'jquery.i18n', {
		beforeEach: function () {
			$.i18n( {
				locale: 'en'
			} );
		},
		afterEach: function () {
			$.i18n().destroy();
		}
	} );

	QUnit.test( 'Message parse tests (en)', function ( assert ) {
		var pluralAndGenderMessage,
			pluralAndGenderMessageWithLessParaMS,
			pluralAndGenderMessageWithCase,
			pluralAndGenderMessageWithSyntaxError,
			pluralAndGenderMessageWithSyntaxError2,
			i18n = $( document ).data( 'i18n' );

	    var done = assert.async();
		$.when(
			i18n.load( 'i18n/test-en.json', 'en' )
		).always( function () {
			assert.strictEqual( i18n.locale, 'en', 'Locale is English' );
			assert.strictEqual( $.i18n( 'message_1' ), 'ONE', 'Simple message' );
			done();
		} );
		assert.strictEqual(
			$.i18n( 'This message key does not exist' ),
			'This message key does not exist',
			'This message key does not exist'
		);
		assert.strictEqual( $.i18n( 'Hello $1', 'Bob' ), 'Hello Bob', 'Parameter replacement' );
		pluralAndGenderMessage = '$1 has $2 {{plural:$2|kitten|kittens}}. ' +
			'{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
		pluralAndGenderMessageWithLessParaMS = '$1 has $2 {{plural:$2|kitten}}. ' +
			'{{gender:$3|He|She}} loves to play with {{plural:$2|it}}.';
		pluralAndGenderMessageWithCase = '$1 has $2 {{plURAl:$2|kitten}}. ' +
			'{{genDER:$3|He|She}} loves to play with {{pLural:$2|it}}.';
		pluralAndGenderMessageWithSyntaxError = '$1 has $2 {{plural:$2|kitten}. ' +
			'{{gender:$3|He|She}} loves to play with {plural:$2|it}}.';
		pluralAndGenderMessageWithSyntaxError2 = '$1 has $2 {{plural:$2|kitten}}. ' +
			'{gender:$3|He|She}} loves to play with {plural:$2|it}}.';
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Meera', 1, 'female' ),
			'Meera has 1 kitten. She loves to play with it.',
			'Plural and gender test - female, singular'
		);
		assert.throws(
			function () {
				$.i18n( pluralAndGenderMessageWithSyntaxError, 'Meera', 1, 'female' );
			},
			/Parse error at position 10/,
			'Message has syntax error'
		);
		assert.throws(
			function () {
				$.i18n( pluralAndGenderMessageWithSyntaxError2, 'Meera', 1, 'female' );
			},
			/Parse error at position 32/,
			'Message has syntax error'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessageWithLessParaMS, 'Meera', 1, 'female' ),
			'Meera has 1 kitten. She loves to play with it.',
			'Plural and gender test - female, singular, but will less parameters in message'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessageWithCase, 'Meera', 1, 'female' ),
			'Meera has 1 kitten. She loves to play with it.',
			'Plural and gender test - female, singular. Plural, gender keywords with upper and lower case'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Meera', 1, 'randomtext' ),
			'Meera has 1 kitten. He loves to play with it.',
			'Plural and gender test - wrong gender- fallback to fist gender'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage ),
			'$1 has $2 kittens. He loves to play with them.',
			'Plural and gender test - no params passed. Should not fail'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Meera', 1, 'randomtext', 'extraparam' ),
			'Meera has 1 kitten. He loves to play with it.',
			'Plural and gender test - more params passed. Should not fail'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Harry', 2, 'male' ),
			'Harry has 2 kittens. He loves to play with them.',
			'Plural and gender test - male, plural'
		);
		assert.strictEqual(
			$.i18n( 'This costs $1.' ),
			'This costs $1.',
			'No parameter supplied, $1 appears as is'
		);

	} );

	$.when(
		$.i18n().load( 'i18n/test-ml.json', 'ml' )
	).then( function () {
		QUnit.test( 'Message parse tests (ml, fr)', function ( assert ) {
			var i18n = $( document ).data( 'i18n' ),
				pluralAndGenderMessage;
			$.i18n( {
				locale: 'ml'
			} );
			assert.strictEqual( i18n.locale, 'ml', 'Locale is Malayalam' );
			assert.strictEqual( $.i18n( 'message_1' ), 'ഒന്ന്', 'Simple message' );
			assert.strictEqual( $.i18n( 'This message key does not exist' ),
				'This message key does not exist', 'This message key does not exist' );
			assert.strictEqual( $.i18n( 'Hello $1', 'Bob' ), 'Hello Bob', 'Parameter replacement' );
			pluralAndGenderMessage = '$1 has $2 {{plural:$2|kitten|kittens}}. ' +
				'{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
			assert.strictEqual( $.i18n( pluralAndGenderMessage, 'മീര', 1, 'female' ),
				'മീരയ്ക്കു് ഒരു പൂച്ചക്കുട്ടി ഉണ്ടു്. അവൾ അതുമായി കളിക്കാൻ ഇഷ്ടപ്പെടുന്നു.',
				'Plural and gender test - female, singular' );
			assert.strictEqual( $.i18n( pluralAndGenderMessage, 'ഹാരി', 2, 'male' ),
				'ഹാരിയ്ക്കു് 2 പൂച്ചക്കുട്ടികൾ ഉണ്ടു്. അവൻ അവറ്റകളുമായി കളിക്കാൻ ഇഷ്ടപ്പെടുന്നു.',
				'Plural and gender test - male, plural' );
			i18n.locale = 'fr';
			assert.strictEqual( $.i18n( 'Restaurer $1 modification{{PLURAL:$1||s}}', 1 ),
				'Restaurer 1 modification', 'Plural rule parsed correctly for French' );
			assert.strictEqual( $.i18n( 'Restaurer $1 modification{{PLURAL:$1||s}}', 2 ),
				'Restaurer 2 modifications', 'Plural rule parsed correctly for French' );
		} );
	} );

	QUnit.test( 'Message load tests', function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		assert.strictEqual( i18n.locale, 'en', 'Locale is English - fallback locale' );

		// Load without any parameter
		i18n.locale = 'test-en'; // Ensure a test locale
		i18n.load();
		assert.strictEqual( $.i18n( 'message_3' ), 'THREE', 'Messages loaded for locale test-en' );

		i18n.locale = 'localex';
		assert.strictEqual( i18n.locale, 'localex', 'Locale is localex' );

		// Load messages for localez
		i18n.load( {
			x: 'X'
		}, 'localex' );
		assert.strictEqual(
			$.i18n( 'x' ),
			'X',
			'Message loaded for localex, message key "x" is present'
		);

		// Load messages for two locales - localey and localez
		i18n.load( {
			localey: {
				y: 'Y'
			},
			localez: {
				z: 'Z'
			}
		} );
		i18n.load( {
			localey: {
				y1: 'Y1'
			}
		} );

		// Switch to locale localey
		i18n.locale = 'localey';
		assert.strictEqual( i18n.locale, 'localey', 'Locale switched to localey' );
		assert.strictEqual(
			$.i18n( 'y1' ),
			'Y1',
			'Message loaded for localey, message key "y1" is present'
		);
		assert.strictEqual(
			$.i18n( 'y' ),
			'Y',
			'Message loaded for localey, message key "y" is still present, not overwritten by second message load.'
		);

		// Switch back to locale localex
		i18n.locale = 'localex';
		assert.strictEqual( i18n.locale, 'localex', 'Going back-Locale is localex' );
		assert.strictEqual( $.i18n( 'x' ), 'X', 'Messages are not lost for localex' );

		// Switch to locale localez
		i18n.locale = 'localez';
		assert.strictEqual( i18n.locale, 'localez', 'Locale is localez' );
		assert.strictEqual(
			$.i18n( 'z' ),
			'Z',
			'Message loaded for localez, message key "z" is present'
		);

		// Load messages for en - with and without country code
		i18n.load( {
			'en-US': {
				'english-us': 'English-US'
			},
			en: {
				english: 'English'
			}
		} );
		i18n.locale = 'en-US';
		assert.strictEqual( i18n.locale, 'en-US', 'Locale is en-US' );
		assert.strictEqual(
			$.i18n( 'english-us' ),
			'English-US',
			'Message loaded for en-US, message key "english-us" is present'
		);
		assert.strictEqual(
			$.i18n( 'english' ),
			'English',
			'Message was resolved from en even though current locale is en-US'
		);
	} );

	QUnit.module( 'jquery.i18n - Fallback test', {
		beforeEach: function () {
			$.i18n().destroy();
			$.i18n();
		},
		afterEach: function () {
			$.i18n().destroy();
		}
	} );

	QUnit.test( 'Locale Fallback test', function ( assert ) {
		var i18n = $( document ).data( 'i18n' );
		i18n.locale = 'sa';
		i18n.load( {
			hindi: 'हिन्दी'
		}, 'hi' );
		i18n.load( {
			'this-does-not-exist': 'This does not exist'
		}, 'en' );
		assert.strictEqual( i18n.locale, 'sa', 'Locale is Sanskrit' );
		assert.strictEqual( $.i18n( 'hindi' ), 'हिन्दी', 'Message got from fallback locale - Hindi' );
		assert.strictEqual( $.i18n( 'this-does-not-exist' ), 'This does not exist', 'Message got from fallback locale - English' );
		i18n.locale = 'tt-cyrl';
		i18n.load( {
			tt: 'russian-tt'
		}, 'ru' );
		assert.strictEqual( i18n.locale, 'tt-cyrl', 'Locale is tt-cyrl' );
		assert.strictEqual( $.i18n( 'tt' ), 'russian-tt',
			'Message is from fallback locale - Russian' );
		i18n.locale = 'tt';
		assert.strictEqual( $.i18n().locale, 'tt', 'Locale is tt' );
		assert.strictEqual( $.i18n( 'tt' ), 'russian-tt',
			'Message is from fallback locale - Russian' );
	} );

	QUnit.test( 'Message parse plural tests for Arabic', function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		// Switch to locale locally
		i18n.locale = 'ar';
		assert.strictEqual( i18n.locale, 'ar', 'Locale is Arabic' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 1 ), 'one',
			'Arabic plural test for one' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', '٠' ), 'zero',
			'Arabic plural test for arabic digit zero' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 2 ), 'two',
			'Arabic plural test for two' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 3 ), 'few',
			'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', '٨' ), 'few',
			'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 9 ), 'few',
			'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 110 ), 'few',
			'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 11 ), 'many',
			'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 15 ), 'many',
			'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 99 ), 'many',
			'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 9999 ), 'many',
			'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 100 ), 'other',
			'Arabic plural test for other' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 102 ), 'other',
			'Arabic plural test for other' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 1000 ), 'other',
			'Arabic plural test for other' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 1.7 ), 'other',
			'Arabic decimal plural test for one' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', '٠١٢٣٤٥٦٧٨٩' ), 'many',
			'Arabic plural test for ۰۱۲۳۴۵۶۷۸۹' );
	} );

	QUnit.test( 'Test explicit plural forms', function ( assert ) {
		$.i18n();
		assert.strictEqual( $.i18n.languages[ 'default' ].convertPlural( 0, [ '0=Explicit Zero', 'Singular', 'Plural' ] ),
			'Explicit Zero', 'Explicit Zero' );

		assert.strictEqual( $.i18n.languages[ 'default' ].convertPlural( 1, [ '0=Explicit Zero', 'Singular', 'Plural', '1=Explicit One' ] ),
			'Explicit One', 'Explicit One' );

		assert.strictEqual( $.i18n.languages[ 'default' ].convertPlural( 1, [ '0=Explicit Zero', 'Singular', 'Plural' ] ),
			'Singular', 'Singular' );

		assert.strictEqual( $.i18n.languages[ 'default' ].convertPlural( 3, [ '0=Explicit Zero', '1=Explicit One', 'Singular', 'Plural' ] ),
			'Plural', 'Plural' );
		// See https://bugzilla.wikimedia.org/69993
		assert.strictEqual( $.i18n( 'Found {{PLURAL:$1|$1 results|1=$1 result}}', 1 ), 'Found 1 result', 'Plural message with explicit plural forms, plural form contains placeholder.' );
	} );

	QUnit.test( 'Digit transform table tests', function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		// Switch to locale locally
		i18n.locale = 'fa';
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8' ), '۸',
			'Persian transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8', true ), 8,
			'Persian transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '0123456789' ), '۰۱۲۳۴۵۶۷۸۹',
			'Persian transform of 0123456789' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '۰۱۲۳۴۵۶۷۸۹', true ), 123456789,
			'Persian transform of 0123456789' );
	} );

	QUnit.test( 'Digit transform table tests', function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		// Switch to locale locally
		i18n.locale = 'ar';
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8' ), '٨',
			'Arabic transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8', true ), 8,
			'Arabic transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '0123456789' ), '٠١٢٣٤٥٦٧٨٩',
			'Arabic transform of 0123456789' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '٠١٢٣٤٥٦٧٨٩', true ), 123456789,
			'Arabic transform of 0123456789' );
	} );

	QUnit.test( 'Support fallback loading from folder tests', function ( assert ) {
		var i18n = $( document ).data( 'i18n' );

	    var done = assert.async();
		$.when(
			i18n.load( 'i18n/fallback', 'uk' )
		).then( function () {
			i18n.locale = 'uk';
			assert.strictEqual( i18n.locale, 'uk', 'Locale is uk' );
			assert.strictEqual( $.i18n( 'message_1' ), 'ONE',
				'Message loaded from fallback locale English' );
	        done();
		} );
	} );

	function grammarTest( langCode, test ) {
		QUnit.test( 'Grammar test for language ' + langCode, function ( assert ) {
			assert.expect( test.length + 1 );
			var i, grammarMessage,
				i18n = $.i18n( {
					locale: langCode
				} );
			assert.strictEqual( i18n.locale, langCode, 'Locale is ' + langCode );
			for ( i = 0; i < test.length; i++ ) {
				grammarMessage = '{{GRAMMAR:' + test[ i ].grammarForm + '|' +
					test[ i ].word + '}}';
				assert.equal( i18n.parse( grammarMessage ), test[ i ].expected,
					test[ i ].description );
			}
		} );
	}

	var grammarTests = {
		bs: [ {
			word: 'word',
			grammarForm: 'instrumental',
			expected: 's word',
			description: 'Grammar test for instrumental case'
		}, {
			word: 'word',
			grammarForm: 'lokativ',
			expected: 'o word',
			description: 'Grammar test for lokativ case'
		} ],

		dsb: [ {
			word: 'word',
			grammarForm: 'instrumental',
			expected: 'z word',
			description: 'Grammar test for instrumental case'
		}, {
			word: 'word',
			grammarForm: 'lokatiw',
			expected: 'wo word',
			description: 'Grammar test for lokatiw case'
		} ],

		fi: [ {
			word: 'talo',
			grammarForm: 'genitive',
			expected: 'talon',
			description: 'Grammar test for genitive case'
		}, {
			word: 'linux',
			grammarForm: 'genitive',
			expected: 'linuxin',
			description: 'Grammar test for genitive case'
		}, {
			word: 'talo',
			grammarForm: 'elative',
			expected: 'talosta',
			description: 'Grammar test for elative case'
		}, {
			word: 'pastöroitu',
			grammarForm: 'partitive',
			expected: 'pastöroitua',
			description: 'Grammar test for partitive case'
		}, {
			word: 'talo',
			grammarForm: 'partitive',
			expected: 'taloa',
			description: 'Grammar test for partitive case'
		}, {
			word: 'talo',
			grammarForm: 'illative',
			expected: 'taloon',
			description: 'Grammar test for illative case'
		}, {
			word: 'linux',
			grammarForm: 'inessive',
			expected: 'linuxissa',
			description: 'Grammar test for inessive case'
		} ],

		ga: [ {
			word: 'an Domhnach',
			grammarForm: 'ainmlae',
			expected: 'Dé Domhnaigh',
			description: 'Grammar test for ainmlae case'
		}, {
			word: 'an Luan',
			grammarForm: 'ainmlae',
			expected: 'Dé Luain',
			description: 'Grammar test for ainmlae case'
		}, {
			word: 'an Satharn',
			grammarForm: 'ainmlae',
			expected: 'Dé Sathairn',
			description: 'Grammar test for ainmlae case'
		} ],

		he: [ {
			word: 'ויקיפדיה',
			grammarForm: 'prefixed',
			expected: 'וויקיפדיה',
			description: 'Duplicate the "Waw" if prefixed'
		}, {
			word: 'וולפגנג',
			grammarForm: 'prefixed',
			expected: 'וולפגנג',
			description: 'Duplicate the "Waw" if prefixed, but not if it is already duplicated.'
		}, {
			word: 'הקובץ',
			grammarForm: 'prefixed',
			expected: 'קובץ',
			description: 'Remove the "He" if prefixed'
		}, {
			word: 'Wikipedia',
			grammarForm: 'תחילית',
			expected: '־Wikipedia',
			description: 'Add a hyphen (maqaf) before non-Hebrew letters'
		}, {
			word: '1995',
			grammarForm: 'תחילית',
			expected: '־1995',
			description: 'Add a hyphen (maqaf) before numbers'
		} ],

		hsb: [ {
			word: 'word',
			grammarForm: 'instrumental',
			expected: 'z word',
			description: 'Grammar test for instrumental case'
		}, {
			word: 'word',
			grammarForm: 'lokatiw',
			expected: 'wo word',
			description: 'Grammar test for lokatiw case'
		} ],

		hu: [ {
			word: 'Wikipédiá',
			grammarForm: 'rol',
			expected: 'Wikipédiáról',
			description: 'Grammar test for rol case'
		}, {
			word: 'Wikipédiá',
			grammarForm: 'ba',
			expected: 'Wikipédiába',
			description: 'Grammar test for ba case'
		}, {
			word: 'Wikipédiá',
			grammarForm: 'k',
			expected: 'Wikipédiák',
			description: 'Grammar test for k case'
		} ],

		hy: [ {
			word: 'Մաունա',
			grammarForm: 'genitive',
			expected: 'Մաունայի',
			description: 'Grammar test for genitive case'
		}, {
			word: 'հետո',
			grammarForm: 'genitive',
			expected: 'հետոյի',
			description: 'Grammar test for genitive case'
		}, {
			word: 'գիրք',
			grammarForm: 'genitive',
			expected: 'գրքի',
			description: 'Grammar test for genitive case'
		}, {
			word: 'ժամանակի',
			grammarForm: 'genitive',
			expected: 'ժամանակիի',
			description: 'Grammar test for genitive case'
		} ],

		la: [ {
			word: 'Translatio',
			grammarForm: 'genitive',
			expected: 'Translationis',
			description: 'Grammar test for genitive case'
		}, {
			word: 'Translatio',
			grammarForm: 'accusative',
			expected: 'Translationem',
			description: 'Grammar test for accusative case'
		}, {
			word: 'Translatio',
			grammarForm: 'ablative',
			expected: 'Translatione',
			description: 'Grammar test for ablative case'
		} ],

		os: [ {
			word: 'бæстæ',
			grammarForm: 'genitive',
			expected: 'бæсты',
			description: 'Grammar test for genitive case'
		}, {
			word: 'бæстæ',
			grammarForm: 'allative',
			expected: 'бæстæм',
			description: 'Grammar test for allative case'
		}, {
			word: 'Тигр',
			grammarForm: 'dative',
			expected: 'Тигрæн',
			description: 'Grammar test for dative case'
		}, {
			word: 'цъити',
			grammarForm: 'dative',
			expected: 'цъитийæн',
			description: 'Grammar test for dative case'
		}, {
			word: 'лæппу',
			grammarForm: 'genitive',
			expected: 'лæппуйы',
			description: 'Grammar test for genitive case'
		}, {
			word: '2011',
			grammarForm: 'equative',
			expected: '2011-ау',
			description: 'Grammar test for equative case'
		} ],

		ru: [ {
			word: 'транслэйтвики',
			grammarForm: 'genitive',
			expected: 'транслэйтвики',
			description: 'Grammar test for genitive case'
		}, {
			word: 'тесть',
			grammarForm: 'genitive',
			expected: 'тестя',
			description: 'Grammar test for genitive case'
		}, {
			word: 'привилегия',
			grammarForm: 'genitive',
			expected: 'привилегии',
			description: 'Grammar test for genitive case'
		}, {
			word: 'установка',
			grammarForm: 'genitive',
			expected: 'установки',
			description: 'Grammar test for genitive case'
		}, {
			word: 'похоти',
			grammarForm: 'genitive',
			expected: 'похотей',
			description: 'Grammar test for genitive case'
		}, {
			word: 'доводы',
			grammarForm: 'genitive',
			expected: 'доводов',
			description: 'Grammar test for genitive case'
		}, {
			word: 'песчаник',
			grammarForm: 'genitive',
			expected: 'песчаника',
			description: 'Grammar test for genitive case'
		} ],

		sl: [ {
			word: 'word',
			grammarForm: 'orodnik',
			expected: 'z word',
			description: 'Grammar test for orodnik case'
		}, {
			word: 'word',
			grammarForm: 'mestnik',
			expected: 'o word',
			description: 'Grammar test for mestnik case'
		} ],

		uk: [ {
			word: 'транслейтвікі',
			grammarForm: 'genitive',
			expected: 'транслейтвікі',
			description: 'Grammar test for genitive case'
		}, {
			word: 'тесть',
			grammarForm: 'genitive',
			expected: 'тестя',
			description: 'Grammar test for genitive case'
		}, {
			word: 'Вікіпедія',
			grammarForm: 'genitive',
			expected: 'Вікіпедії',
			description: 'Grammar test for genitive case'
		}, {
			word: 'установка',
			grammarForm: 'genitive',
			expected: 'установки',
			description: 'Grammar test for genitive case'
		}, {
			word: 'похоти',
			grammarForm: 'genitive',
			expected: 'похотей',
			description: 'Grammar test for genitive case'
		}, {
			word: 'доводы',
			grammarForm: 'genitive',
			expected: 'доводов',
			description: 'Grammar test for genitive case'
		}, {
			word: 'песчаник',
			grammarForm: 'genitive',
			expected: 'песчаника',
			description: 'Grammar test for genitive case'
		}, {
			word: 'Вікіпедія',
			grammarForm: 'accusative',
			expected: 'Вікіпедію',
			description: 'Grammar test for accusative case'
		} ],
		ml: [ {
			word: 'കാവ്യ',
			grammarForm: 'ഉദ്ദേശിക',
			expected: 'കാവ്യയ്ക്ക്',
			description: 'Grammar test for dative case'
		}, {
			word: 'പുലി',
			grammarForm: 'dative',
			expected: 'പുലിയ്ക്ക്',
			description: 'Grammar test for dative case'
		}, {
			word: 'ഉപ്പ്',
			grammarForm: 'dative',
			expected: 'ഉപ്പിന്',
			description: 'Grammar test for dative case'
		}, {
			word: 'മയില്‍',
			grammarForm: 'dative',
			expected: 'മയിലിന്',
			description: 'Grammar test for dative case'
		}, {
			word: 'അവര്‍',
			grammarForm: 'dative',
			expected: 'അവര്‍ക്ക്',
			description: 'Grammar test for dative case'
		}, {
			word: 'അവന്‍',
			grammarForm: 'dative',
			expected: 'അവന്',
			description: 'Grammar test for dative case'
		}, {
			word: 'മാളു',
			grammarForm: 'dative',
			expected: 'മാളുവിന്',
			description: 'Grammar test for dative case'
		}, {
			word: 'മാളു',
			grammarForm: 'genitive',
			expected: 'മാളുവിന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'മയില്‍',
			grammarForm: 'genitive',
			expected: 'മയിലിന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'അവര്‍',
			grammarForm: 'genitive',
			expected: 'അവരുടെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'അവന്‍',
			grammarForm: 'genitive',
			expected: 'അവന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'ഉപ്പ്',
			grammarForm: 'genitive',
			expected: 'ഉപ്പിന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'പുലി',
			grammarForm: 'genitive',
			expected: 'പുലിയുടെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'ഇന്ത്യ',
			grammarForm: 'genitive',
			expected: 'ഇന്ത്യയുടെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'കേരളം',
			grammarForm: 'genitive',
			expected: 'കേരളത്തിന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'യൂറോപ്പ്',
			grammarForm: 'സംബന്ധിക',
			expected: 'യൂറോപ്പിന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'വയറു്',
			grammarForm: 'സംബന്ധിക',
			expected: 'വയറിന്റെ',
			description: 'Grammar test for genitive case'
		}, {
			word: 'കയറ്',
			grammarForm: 'സംബന്ധിക',
			expected: 'കയറിന്റെ',
			description: 'Grammar test for genitive case'
		} ]
	};

	$.each( grammarTests, function ( langCode, test ) {
		grammarTest( langCode, test );
	} );

	QUnit.test( 'Bidi message arguments', function ( assert ) {
		var i18n = $( document ).data( 'i18n' );
		i18n.locale = 'he';
		i18n.load( {
			'greet-msg': 'שלום {{bidi:$1}} הי!'
		}, 'he' );
		assert.strictEqual(
			$.i18n( 'greet-msg', '123' ),
			'שלום ' + '123' + ' הי!',
			'Bidi with neutral argument'
		);
		assert.strictEqual(
			$.i18n( 'greet-msg', 'Ben_(WMF)' ),
			'שלום ' + '\u202A' + 'Ben_(WMF)' + '\u202C' + ' הי!',
			'Bidi with LTR argument'
		);
		assert.strictEqual(
			$.i18n( 'greet-msg', 'יהודי (מנוחין)' ),
			'שלום ' + '\u202B' + 'יהודי (מנוחין)' + '\u202C' + ' הי!',
			'Bidi with RTL argument'
		);
	} );
}( jQuery ) );
