/* global pluralRuleParser, QUnit, jQuery */
( function ( $ ) {
	"use strict";

	module( 'jquery.i18n - $.fn.i18n Tests', {
		setup: function () {
			$.i18n( {
				locale: 'localex'
			} );
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );


	test( "Message parse tests", function ( assert ) {
		var i18n = $.i18n();
		var $fixture = $( '#qunit-fixture' );
		// Load messages for localex
		i18n.load( {
			'x': 'X'
		}, 'localex' );
		$fixture.data( 'i18n', 'x' );
		assert.strictEqual( $fixture.i18n().text(), "X", "Content of fixture localized" );
		$fixture.text( "Original text" );
		$fixture.data( 'i18n', 'y' );
		assert.strictEqual( $fixture.i18n().text(), "Original text", "Content of fixture untouched" );
	} );

	module( 'jquery.i18n - Basic tests for English', {
		setup: function () {
			$.i18n( {
				locale: 'en'
			} );
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( "Message parse tests", function ( assert ) {
		assert.strictEqual( $.i18n().locale, "en", "Locale is English" );
		assert.strictEqual( _( "message_1" ), "ONE", "Simple message" );
		assert.strictEqual( _( "This message key does not exist" ),
				"This message key does not exist", "This message key does not exist" );
		assert.strictEqual( _( "Hello $1", "Bob" ), "Hello Bob", "Parameter replacement" );
		var pluralAndGenderMessage = "$1 has $2 {{plural:$2|kitten|kittens}}. "
				+ "{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.";
		assert.strictEqual( _( pluralAndGenderMessage, "Meera", 1, "female" ),
				"Meera has 1 kitten. She loves to play with it.",
				"Plural and gender test - female, singular" );
		assert.strictEqual( _( pluralAndGenderMessage, "Harry", 2, "male" ),
				"Harry has 2 kittens. He loves to play with them.",
				"Plural and gender test - male, plural" );
		assert.strictEqual( _( "This costs $1." ), "This costs $1.",
				"No parameter supplied, $1 appears as is" );
	} );

	module( 'jquery.i18n - Basic tests for Malayalam', {
		setup: function () {
			$.i18n( {
				locale: 'ml'
			} );
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( "Message parse tests", function ( assert ) {
		assert.strictEqual( $.i18n().locale, "ml", "Locale is Malayalam" );
		assert.strictEqual( _( "message_1" ), "ഒന്ന്", "Simple message" );
		assert.strictEqual( _( "This message key does not exist" ),
				"This message key does not exist", "This message key does not exist" );
		assert.strictEqual( _( "Hello $1", "Bob" ), "Hello Bob", "Parameter replacement" );
		var pluralAndGenderMessage = "$1 has $2 {{plural:$2|kitten|kittens}}. "
				+ "{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.";
		assert.strictEqual( _( pluralAndGenderMessage, "മീര", 1, "female" ),
				"മീരയ്ക്കു് ഒരു പൂച്ചക്കുട്ടി ഉണ്ടു്. അവൾ അതുമായി കളിക്കാൻ ഇഷ്ടപ്പെടുന്നു.",
				"Plural and gender test - female, singular" );
		assert.strictEqual( _( pluralAndGenderMessage, "ഹാരി", 2, "male" ),
				"ഹാരിയ്ക്കു് 2 പൂച്ചക്കുട്ടികൾ ഉണ്ടു്. അവൻ അവറ്റകളുമായി കളിക്കാൻ ഇഷ്ടപ്പെടുന്നു.",
				"Plural and gender test - male, plural" );
	} );

	module( 'jquery.i18n - Locale switching', {
		setup: function () {
			$.i18n();
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( "Message load tests", function ( assert ) {
		var i18n = $.i18n();
		assert.strictEqual( $.i18n().locale, "en", "Locale is English - fallback locale" );
		i18n.locale = 'localex';
		assert.strictEqual( $.i18n().locale, "localex", "Locale is localex" );
		// Load messages for localez
		i18n.load( {
			'x': 'X'
		}, 'localex' );
		assert
				.strictEqual( _( 'x' ), "X",
						"Message loaded for localex, message key 'x' is present" );
		// Load messages for two locales - localey and localez
		i18n.load( {
			'localey': {
				'y': 'Y'
			},
			'localez': {
				'z': 'Z'
			}
		} );
		// Switch to locale localey
		i18n.locale = 'localey';
		assert.strictEqual( $.i18n().locale, "localey", "Locale switched to localey" );
		assert
				.strictEqual( _( 'y' ), "Y",
						"Message loaded for localey, message key 'y' is present" );
		// Switch back to locale localex
		i18n.locale = 'localex';
		assert.strictEqual( $.i18n().locale, "localex", "Going back-Locale is localex" );
		assert.strictEqual( _( 'x' ), "X", "Messages are not lost for localex" );
		// Switch to locale localez
		i18n.locale = 'localez';
		assert.strictEqual( $.i18n().locale, "localez", "Locale is localez" );
		assert
				.strictEqual( _( 'z' ), "Z",
						"Message loaded for localez, message key 'z' is present" );
		i18n.load( {
			'localeq': 'i18n/test-q.json'
		} );
		assert.strictEqual( i18n.messageStore.sources['localeq'][0], 'i18n/test-q.json',
				"Locale localeq is queued" );
		// Switch to locale localeq
		i18n.locale = 'localeq';
		assert.strictEqual( i18n.messageStore.sources['localeq'][0], 'i18n/test-q.json',
				"Locale localeq is still in queue" );
		assert.strictEqual( _( 'q' ), "Q", "Message loaded for localeq" );
		assert.strictEqual( i18n.messageStore.sources['localeq'], undefined,
				"Locale localeq is not in queue" );
	} );

	module( 'jquery.i18n - Fallback test', {
		setup: function () {
			$.i18n();
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( "Locale Fallback test", function ( assert ) {
		var i18n = $.i18n();
		i18n.locale = 'sa';
		i18n.load( {
			"hindi": "हिन्दी"
		}, "hi" );
		assert.strictEqual( $.i18n().locale, "sa", "Locale is Sanscrit" );
		assert.strictEqual( $.i18n( 'hindi' ), "हिन्दी", "Message got from fallback locale - Hindi" );
		i18n.locale = 'tt-cyrl';
		i18n.load( {
			"tt": "russian-tt"
		}, "ru" );
		assert.strictEqual( $.i18n().locale, "tt-cyrl", "Locale is tt-cyrl" );
		assert.strictEqual( $.i18n( 'tt' ), "russian-tt",
				"Message is from fallback locale - Russian" );
		i18n.locale = 'tt';
		assert.strictEqual( $.i18n().locale, "tt", "Locale is tt" );
		assert.strictEqual( $.i18n( 'tt' ), "russian-tt",
				"Message is from fallback locale - Russian" );
	} );

	module( 'jquery.i18n - Plural rule tests', {
		setup: function () {
			$.i18n();
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( "Message parse plural tests for Arabic", function ( assert ) {
		var i18n = $.i18n();
		// Switch to locale localey
		i18n.locale = 'ar';
		assert.strictEqual( $.i18n().locale, "ar", "Locale is Arabic" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 1 ), "one",
				"Arabic plural test for one" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", '۰' ), "zero",
				"Arabic plural test for arabic digit zero" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 2 ), "two",
				"Arabic plural test for two" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 3 ), "few",
				"Arabic plural test for few" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", '۸' ), "few",
				"Arabic plural test for few" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 9 ), "few",
				"Arabic plural test for few" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 110 ), "few",
				"Arabic plural test for few" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 11 ), "many",
				"Arabic plural test for many" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 15 ), "many",
				"Arabic plural test for many" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 99 ), "many",
				"Arabic plural test for many" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 9999 ), "many",
				"Arabic plural test for many" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 100 ), "other",
				"Arabic plural test for other" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 102 ), "other",
				"Arabic plural test for other" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 1000 ), "other",
				"Arabic plural test for other" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", 1.7 ), "other",
				"Arabic plural test for other" );
		assert.strictEqual( _( "{{plural:$1|zero|one|two|few|many|other}}", '۰۱۲۳۴۵۶۷۸۹' ), "many",
				"Arabic plural test for ۰۱۲۳۴۵۶۷۸۹" );
	} );

	module( 'jquery.i18n - Digit transform tests', {
		setup: function () {
			$.i18n();
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( "Digit transform table tests", function ( assert ) {
		var i18n = $.i18n();
		// Switch to locale localey
		i18n.locale = 'ar';
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8' ), '۸',
				"Arabic transform of 8" );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8', true ), 8,
				"Arabic transform of 8" );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '0123456789' ), "۰۱۲۳۴۵۶۷۸۹",
				"Arabic transform of 0123456789" );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '۰۱۲۳۴۵۶۷۸۹', true ), 123456789,
				"Arabic transform of 0123456789" );
	} );

	module( 'jquery.i18n - Grammar tests', {
		setup: function () {
			$.i18n();
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	function grammarTest ( langCode, test ) {
		$.i18n().destroy();

		QUnit.test( 'Grammar test for language ' + langCode,
			function ( assert ) {
				QUnit.expect( test.length + 1 );
				var i18n = $.i18n( {
					locale: langCode
				} );
				assert.strictEqual( i18n.locale, langCode, "Locale is " + langCode );
				for ( var i = 0; i < test.length; i++) {
					var grammarMessage = "{{GRAMMAR:" + test[i].grammarForm + "|"
							+ test[i].word + "}}";
					assert.equal( i18n.parse( grammarMessage ), test[i].expected,
							test[i].description );
				}
			} );
		$.i18n().destroy();
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
			word: "ויקיפדיה",
			grammarForm: 'prefixed',
			expected: "וויקיפדיה",
			description: 'Duplicate the "Waw" if prefixed'
		}, {
			word: "וולפגנג",
			grammarForm: 'prefixed',
			expected: "וולפגנג",
			description: 'Duplicate the "Waw" if prefixed, but not if it is already duplicated.'
		}, {
			word: "הקובץ",
			grammarForm: 'prefixed',
			expected: "קובץ",
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
		} ]
	};

	$.each( grammarTests, function ( langCode, test ) {
		grammarTest( langCode, test );
	} );
}( window.jQuery ) );
