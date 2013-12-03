/*global pluralRuleParser */
( function ( $ ) {
	'use strict';

	//noinspection JSHint
	var language = {
		// CLDR plural rules generated using
		// http://i18ndata.appspot.com/cldr/tags/unconfirmed/supplemental/plurals?action=browse&depth=-1
		// and compressed
		"pluralRules": {
			"ar": {
				"zero": "n = 0",
				"one": "n = 1",
				"two": "n = 2",
				"few": "n % 100 = 3..10",
				"many": "n % 100 = 11..99"
			},
			"he": {
				"one": "i = 1 and v = 0",
				"two": "i = 2 and v = 0",
				"many": "v = 0 and n != 0..10 and n % 10 = 0"
			},
			"iw": {
				"one": "i = 1 and v = 0",
				"two": "i = 2 and v = 0",
				"many": "v = 0 and n != 0..10 and n % 10 = 0"
			},
			"ak": {
				"one": "n = 0..1"
			},
			"bh": {
				"one": "n = 0..1"
			},
			"guw": {
				"one": "n = 0..1"
			},
			"ln": {
				"one": "n = 0..1"
			},
			"mg": {
				"one": "n = 0..1"
			},
			"nso": {
				"one": "n = 0..1"
			},
			"pa": {
				"one": "n = 0..1"
			},
			"ti": {
				"one": "n = 0..1"
			},
			"wa": {
				"one": "n = 0..1"
			},
			"ff": {
				"one": "i = 0,1"
			},
			"fr": {
				"one": "i = 0,1"
			},
			"hy": {
				"one": "i = 0,1"
			},
			"kab": {
				"one": "i = 0,1"
			},
			"lv": {
				"zero": "n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19",
				"one": "n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1"
			},
			"iu": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"kw": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"naq": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"se": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"sma": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"smi": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"smj": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"smn": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"sms": {
				"one": "n = 1",
				"two": "n = 2"
			},
			"ga": {
				"one": "n = 1",
				"two": "n = 2",
				"few": "n = 3..6",
				"many": "n = 7..10"
			},
			"mo": {
				"one": "i = 1 and v = 0",
				"few": "v != 0 or n = 0 or n != 1 and n % 100 = 1..19"
			},
			"ro": {
				"one": "i = 1 and v = 0",
				"few": "v != 0 or n = 0 or n != 1 and n % 100 = 1..19"
			},
			"lt": {
				"one": "n % 10 = 1 and n % 100 != 11..19",
				"few": "n % 10 = 2..9 and n % 100 != 11..19",
				"many": "f != 0"
			},
			"be": {
				"one": "n % 10 = 1 and n % 100 != 11",
				"few": "n % 10 = 2..4 and n % 100 != 12..14",
				"many": "n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14"
			},
			"cs": {
				"one": "i = 1 and v = 0",
				"few": "i = 2..4 and v = 0",
				"many": "v != 0"
			},
			"sk": {
				"one": "i = 1 and v = 0",
				"few": "i = 2..4 and v = 0",
				"many": "v != 0"
			},
			"pl": {
				"one": "i = 1 and v = 0",
				"few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14",
				"many": "v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14"
			},
			"sl": {
				"one": "v = 0 and i % 100 = 1",
				"two": "v = 0 and i % 100 = 2",
				"few": "v = 0 and i % 100 = 3..4 or v != 0"
			},
			"mt": {
				"one": "n = 1",
				"few": "n = 0 or n % 100 = 2..10",
				"many": "n % 100 = 11..19"
			},
			"mk": {
				"one": "v = 0 and i % 10 = 1 or f % 10 = 1"
			},
			"cy": {
				"zero": "n = 0",
				"one": "n = 1",
				"two": "n = 2",
				"few": "n = 3",
				"many": "n = 6"
			},
			"lag": {
				"zero": "n = 0",
				"one": "i = 0,1 and n != 0"
			},
			"shi": {
				"one": "i = 0 or n = 1",
				"few": "n = 2..10"
			},
			"br": {
				"one": "n % 10 = 1 and n % 100 != 11,71,91",
				"two": "n % 10 = 2 and n % 100 != 12,72,92",
				"few": "n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99",
				"many": "n != 0 and n % 1000000 = 0"
			},
			"tzm": {
				"one": "n = 0..1 or n = 11..99"
			},
			"gv": {
				"one": "n % 10 = 1",
				"two": "n % 10 = 2",
				"few": "n % 100 = 0,20,40,60"
			},
			"gd": {
				"one": "n = 1,11",
				"two": "n = 2,12",
				"few": "n = 3..10,13..19"
			},
			"fil": {
				"one": "i = 0..1 and v = 0"
			},
			"tl": {
				"one": "i = 0..1 and v = 0"
			},
			"pt": {
				"one": "i = 1 and v = 0 or i = 0 and t = 1"
			},
			"da": {
				"one": "n = 1 or t != 0 and i = 0,1"
			},
			"pt_PT": {
				"one": "n = 1 and v = 0"
			},
			"am": {
				"one": "i = 0 or n = 1"
			},
			"bn": {
				"one": "i = 0 or n = 1"
			},
			"fa": {
				"one": "i = 0 or n = 1"
			},
			"gu": {
				"one": "i = 0 or n = 1"
			},
			"hi": {
				"one": "i = 0 or n = 1"
			},
			"kn": {
				"one": "i = 0 or n = 1"
			},
			"mr": {
				"one": "i = 0 or n = 1"
			},
			"zu": {
				"one": "i = 0 or n = 1"
			},
			"is": {
				"one": "t = 0 and i % 10 = 1 and i % 100 != 11 or t != 0"
			},
			"si": {
				"one": "n = 0,1 or i = 0 and f = 1"
			},
			"bs": {
				"one": "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11",
				"few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14"
			},
			"hr": {
				"one": "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11",
				"few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14"
			},
			"sh": {
				"one": "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11",
				"few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14"
			},
			"sr": {
				"one": "v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11",
				"few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14"
			},
			"ru": {
				"one": "v = 0 and i % 10 = 1 and i % 100 != 11",
				"many": "v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14"
			},
			"uk": {
				"one": "v = 0 and i % 10 = 1 and i % 100 != 11",
				"few": "v = 0 and i % 10 = 2..4 and i % 100 != 12..14",
				"many": "v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14"
			}
		},

		/**
		 * Plural form transformations, needed for some languages.
		 *
		 * @param count
		 *            integer Non-localized quantifier
		 * @param forms
		 *            array List of plural forms
		 * @return string Correct form for quantifier in this language
		 */
		convertPlural: function ( count, forms ) {
			var pluralRules,
				pluralFormIndex,
				index,
				explicitPluralPattern = new RegExp('\\d+=', 'i'),
				formCount,
				form;

			if ( !forms || forms.length === 0 ) {
				return '';
			}

			// Handle for Explicit 0= & 1= values
			for ( index = 0; index < forms.length; index++ ) {
				form = forms[index];
				if ( explicitPluralPattern.test( form ) ) {
					formCount = parseInt( form.substring( 0, form.indexOf( '=' ) ), 10 );
					if ( formCount === count ) {
						return ( form.substr( form.indexOf( '=' ) + 1 ) );
					}
					forms[index] = undefined;
				}
			}

			forms = $.map( forms, function ( form ) {
				if ( form !== undefined ) {
					return form;
				}
			} );

			pluralRules = this.pluralRules[$.i18n().locale];

			if ( !pluralRules ) {
				// default fallback.
				return ( count === 1 ) ? forms[0] : forms[1];
			}

			pluralFormIndex = this.getPluralForm( count, pluralRules );
			pluralFormIndex = Math.min( pluralFormIndex, forms.length - 1 );

			return forms[pluralFormIndex];
		},

		/**
		 * For the number, get the plural for index
		 *
		 * @param number
		 * @param pluralRules
		 * @return plural form index
		 */
		getPluralForm: function ( number, pluralRules ) {
			var i,
				pluralForms = [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
				pluralFormIndex = 0;

			for ( i = 0; i < pluralForms.length; i++ ) {
				if ( pluralRules[pluralForms[i]] ) {
					if ( pluralRuleParser( pluralRules[pluralForms[i]], number ) ) {
						return pluralFormIndex;
					}

					pluralFormIndex++;
				}
			}

			return pluralFormIndex;
		},

		/**
		 * Converts a number using digitTransformTable.
		 *
		 * @param {number} num Value to be converted
		 * @param {boolean} integer Convert the return value to an integer
		 */
		'convertNumber': function ( num, integer ) {
			var tmp, item, i,
				transformTable, numberString, convertedNumber;

			// Set the target Transform table:
			transformTable = this.digitTransformTable( $.i18n().locale );
			numberString = '' + num;
			convertedNumber = '';

			if ( !transformTable ) {
				return num;
			}

			// Check if the restore to Latin number flag is set:
			if ( integer ) {
				if ( parseFloat( num, 10 ) === num ) {
					return num;
				}

				tmp = [];

				for ( item in transformTable ) {
					tmp[transformTable[item]] = item;
				}

				transformTable = tmp;
			}

			for ( i = 0; i < numberString.length; i++ ) {
				if ( transformTable[numberString[i]] ) {
					convertedNumber += transformTable[numberString[i]];
				} else {
					convertedNumber += numberString[i];
				}
			}

			return integer ? parseFloat( convertedNumber, 10 ) : convertedNumber;
		},

		/**
		 * Grammatical transformations, needed for inflected languages.
		 * Invoked by putting {{grammar:form|word}} in a message.
		 * Override this method for languages that need special grammar rules
		 * applied dynamically.
		 *
		 * @param word {String}
		 * @param form {String}
		 * @return {String}
		 */
		convertGrammar: function ( word, form ) { /*jshint unused: false */
			return word;
		},

		/**
		 * Provides an alternative text depending on specified gender. Usage
		 * {{gender:[gender|user object]|masculine|feminine|neutral}}. If second
		 * or third parameter are not specified, masculine is used.
		 *
		 * These details may be overriden per language.
		 *
		 * @param gender
		 *      string male, female, or anything else for neutral.
		 * @param forms
		 *      array List of gender forms
		 *
		 * @return string
		 */
		'gender': function ( gender, forms ) {
			if ( !forms || forms.length === 0 ) {
				return '';
			}

			while ( forms.length < 2 ) {
				forms.push( forms[forms.length - 1] );
			}

			if ( gender === 'male' ) {
				return forms[0];
			}

			if ( gender === 'female' ) {
				return forms[1];
			}

			return ( forms.length === 3 ) ? forms[2] : forms[0];
		},

		/**
		 * Get the digit transform table for the given language
		 * See http://cldr.unicode.org/translation/numbering-systems
		 * @param language
		 * @returns {Array|boolean} List of digits in the passed language or false
		 * representation, or boolean false if there is no information.
		 */
		digitTransformTable: function ( language ) {
			var tables = {
				ar: '٠١٢٣٤٥٦٧٨٩',
				fa: '۰۱۲۳۴۵۶۷۸۹',
				ml: '൦൧൨൩൪൫൬൭൮൯',
				kn: '೦೧೨೩೪೫೬೭೮೯',
				lo: '໐໑໒໓໔໕໖໗໘໙',
				or: '୦୧୨୩୪୫୬୭୮୯',
				kh: '០១២៣៤៥៦៧៨៩',
				pa: '੦੧੨੩੪੫੬੭੮੯',
				gu: '૦૧૨૩૪૫૬૭૮૯',
				hi: '०१२३४५६७८९',
				my: '၀၁၂၃၄၅၆၇၈၉',
				ta: '௦௧௨௩௪௫௬௭௮௯',
				te: '౦౧౨౩౪౫౬౭౮౯',
				th: '๐๑๒๓๔๕๖๗๘๙', //FIXME use iso 639 codes
				bo: '༠༡༢༣༤༥༦༧༨༩' //FIXME use iso 639 codes
			};

			if ( !tables[language] ) {
				return false;
			}

			return tables[language].split( '' );
		}
	};

	$.extend( $.i18n.languages, {
		'default': language
	} );
}( jQuery ) );
