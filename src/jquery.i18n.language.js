/* global pluralRuleParser */
( function ( $ ) {
	'use strict';

	// jscs:disable
	var language = {
		// CLDR plural rules generated using
		// libs/CLDRPluralRuleParser/tools/PluralXML2JSON.html
		pluralRules: {
			af: {
				one: 'n = 1'
			},
			ak: {
				one: 'n = 0..1'
			},
			am: {
				one: 'i = 0 or n = 1'
			},
			ar: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n % 100 = 3..10',
				many: 'n % 100 = 11..99'
			},
			ars: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n % 100 = 3..10',
				many: 'n % 100 = 11..99'
			},
			as: {
				one: 'i = 0 or n = 1'
			},
			asa: {
				one: 'n = 1'
			},
			ast: {
				one: 'i = 1 and v = 0'
			},
			az: {
				one: 'n = 1'
			},
			be: {
				one: 'n % 10 = 1 and n % 100 != 11',
				few: 'n % 10 = 2..4 and n % 100 != 12..14',
				many: 'n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14'
			},
			bem: {
				one: 'n = 1'
			},
			bez: {
				one: 'n = 1'
			},
			bg: {
				one: 'n = 1'
			},
			bh: {
				one: 'n = 0..1'
			},
			bm: {},
			bn: {
				one: 'i = 0 or n = 1'
			},
			bo: {},
			br: {
				one: 'n % 10 = 1 and n % 100 != 11,71,91',
				two: 'n % 10 = 2 and n % 100 != 12,72,92',
				few: 'n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99',
				many: 'n != 0 and n % 1000000 = 0'
			},
			brx: {
				one: 'n = 1'
			},
			bs: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			ca: {
				one: 'i = 1 and v = 0'
			},
			ce: {
				one: 'n = 1'
			},
			cgg: {
				one: 'n = 1'
			},
			chr: {
				one: 'n = 1'
			},
			ckb: {
				one: 'n = 1'
			},
			cs: {
				one: 'i = 1 and v = 0',
				few: 'i = 2..4 and v = 0',
				many: 'v != 0'
			},
			cy: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n = 3',
				many: 'n = 6'
			},
			da: {
				one: 'n = 1 or t != 0 and i = 0,1'
			},
			de: {
				one: 'i = 1 and v = 0'
			},
			dsb: {
				one: 'v = 0 and i % 100 = 1 or f % 100 = 1',
				two: 'v = 0 and i % 100 = 2 or f % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or f % 100 = 3..4'
			},
			dv: {
				one: 'n = 1'
			},
			dz: {},
			ee: {
				one: 'n = 1'
			},
			el: {
				one: 'n = 1'
			},
			en: {
				one: 'i = 1 and v = 0'
			},
			eo: {
				one: 'n = 1'
			},
			es: {
				one: 'n = 1'
			},
			et: {
				one: 'i = 1 and v = 0'
			},
			eu: {
				one: 'n = 1'
			},
			fa: {
				one: 'i = 0 or n = 1'
			},
			ff: {
				one: 'i = 0,1'
			},
			fi: {
				one: 'i = 1 and v = 0'
			},
			fil: {
				one: 'v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9'
			},
			fo: {
				one: 'n = 1'
			},
			fr: {
				one: 'i = 0,1'
			},
			fur: {
				one: 'n = 1'
			},
			fy: {
				one: 'i = 1 and v = 0'
			},
			ga: {
				one: 'n = 1',
				two: 'n = 2',
				few: 'n = 3..6',
				many: 'n = 7..10'
			},
			gd: {
				one: 'n = 1,11',
				two: 'n = 2,12',
				few: 'n = 3..10,13..19'
			},
			gl: {
				one: 'i = 1 and v = 0'
			},
			gsw: {
				one: 'n = 1'
			},
			gu: {
				one: 'i = 0 or n = 1'
			},
			guw: {
				one: 'n = 0..1'
			},
			gv: {
				one: 'v = 0 and i % 10 = 1',
				two: 'v = 0 and i % 10 = 2',
				few: 'v = 0 and i % 100 = 0,20,40,60,80',
				many: 'v != 0'
			},
			ha: {
				one: 'n = 1'
			},
			haw: {
				one: 'n = 1'
			},
			he: {
				one: 'i = 1 and v = 0',
				two: 'i = 2 and v = 0',
				many: 'v = 0 and n != 0..10 and n % 10 = 0'
			},
			hi: {
				one: 'i = 0 or n = 1'
			},
			hr: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			hsb: {
				one: 'v = 0 and i % 100 = 1 or f % 100 = 1',
				two: 'v = 0 and i % 100 = 2 or f % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or f % 100 = 3..4'
			},
			hu: {
				one: 'n = 1'
			},
			hy: {
				one: 'i = 0,1'
			},
			id: {},
			ig: {},
			ii: {},
			'in': {},
			is: {
				one: 't = 0 and i % 10 = 1 and i % 100 != 11 or t != 0'
			},
			it: {
				one: 'i = 1 and v = 0'
			},
			iu: {
				one: 'n = 1',
				two: 'n = 2'
			},
			iw: {
				one: 'i = 1 and v = 0',
				two: 'i = 2 and v = 0',
				many: 'v = 0 and n != 0..10 and n % 10 = 0'
			},
			ja: {},
			jbo: {},
			jgo: {
				one: 'n = 1'
			},
			ji: {
				one: 'i = 1 and v = 0'
			},
			jmc: {
				one: 'n = 1'
			},
			jv: {},
			jw: {},
			ka: {
				one: 'n = 1'
			},
			kab: {
				one: 'i = 0,1'
			},
			kaj: {
				one: 'n = 1'
			},
			kcg: {
				one: 'n = 1'
			},
			kde: {},
			kea: {},
			kk: {
				one: 'n = 1'
			},
			kkj: {
				one: 'n = 1'
			},
			kl: {
				one: 'n = 1'
			},
			km: {},
			kn: {
				one: 'i = 0 or n = 1'
			},
			ko: {},
			ks: {
				one: 'n = 1'
			},
			ksb: {
				one: 'n = 1'
			},
			ksh: {
				zero: 'n = 0',
				one: 'n = 1'
			},
			ku: {
				one: 'n = 1'
			},
			kw: {
				one: 'n = 1',
				two: 'n = 2'
			},
			ky: {
				one: 'n = 1'
			},
			lag: {
				zero: 'n = 0',
				one: 'i = 0,1 and n != 0'
			},
			lb: {
				one: 'n = 1'
			},
			lg: {
				one: 'n = 1'
			},
			lkt: {},
			ln: {
				one: 'n = 0..1'
			},
			lo: {},
			lt: {
				one: 'n % 10 = 1 and n % 100 != 11..19',
				few: 'n % 10 = 2..9 and n % 100 != 11..19',
				many: 'f != 0'
			},
			lv: {
				zero: 'n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19',
				one: 'n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1'
			},
			mas: {
				one: 'n = 1'
			},
			mg: {
				one: 'n = 0..1'
			},
			mgo: {
				one: 'n = 1'
			},
			mk: {
				one: 'v = 0 and i % 10 = 1 or f % 10 = 1'
			},
			ml: {
				one: 'n = 1'
			},
			mn: {
				one: 'n = 1'
			},
			mo: {
				one: 'i = 1 and v = 0',
				few: 'v != 0 or n = 0 or n != 1 and n % 100 = 1..19'
			},
			mr: {
				one: 'i = 0 or n = 1'
			},
			ms: {},
			mt: {
				one: 'n = 1',
				few: 'n = 0 or n % 100 = 2..10',
				many: 'n % 100 = 11..19'
			},
			my: {},
			nah: {
				one: 'n = 1'
			},
			naq: {
				one: 'n = 1',
				two: 'n = 2'
			},
			nb: {
				one: 'n = 1'
			},
			nd: {
				one: 'n = 1'
			},
			ne: {
				one: 'n = 1'
			},
			nl: {
				one: 'i = 1 and v = 0'
			},
			nn: {
				one: 'n = 1'
			},
			nnh: {
				one: 'n = 1'
			},
			no: {
				one: 'n = 1'
			},
			nqo: {},
			nr: {
				one: 'n = 1'
			},
			nso: {
				one: 'n = 0..1'
			},
			ny: {
				one: 'n = 1'
			},
			nyn: {
				one: 'n = 1'
			},
			om: {
				one: 'n = 1'
			},
			or: {
				one: 'n = 1'
			},
			os: {
				one: 'n = 1'
			},
			pa: {
				one: 'n = 0..1'
			},
			pap: {
				one: 'n = 1'
			},
			pl: {
				one: 'i = 1 and v = 0',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14'
			},
			prg: {
				zero: 'n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19',
				one: 'n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1'
			},
			ps: {
				one: 'n = 1'
			},
			pt: {
				one: 'n = 0..2 and n != 2'
			},
			'pt-PT': {
				one: 'n = 1 and v = 0'
			},
			rm: {
				one: 'n = 1'
			},
			ro: {
				one: 'i = 1 and v = 0',
				few: 'v != 0 or n = 0 or n != 1 and n % 100 = 1..19'
			},
			rof: {
				one: 'n = 1'
			},
			root: {},
			ru: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14'
			},
			rwk: {
				one: 'n = 1'
			},
			sah: {},
			saq: {
				one: 'n = 1'
			},
			sdh: {
				one: 'n = 1'
			},
			se: {
				one: 'n = 1',
				two: 'n = 2'
			},
			seh: {
				one: 'n = 1'
			},
			ses: {},
			sg: {},
			sh: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			shi: {
				one: 'i = 0 or n = 1',
				few: 'n = 2..10'
			},
			si: {
				one: 'n = 0,1 or i = 0 and f = 1'
			},
			sk: {
				one: 'i = 1 and v = 0',
				few: 'i = 2..4 and v = 0',
				many: 'v != 0'
			},
			sl: {
				one: 'v = 0 and i % 100 = 1',
				two: 'v = 0 and i % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or v != 0'
			},
			sma: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smi: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smj: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smn: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sms: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sn: {
				one: 'n = 1'
			},
			so: {
				one: 'n = 1'
			},
			sq: {
				one: 'n = 1'
			},
			sr: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			ss: {
				one: 'n = 1'
			},
			ssy: {
				one: 'n = 1'
			},
			st: {
				one: 'n = 1'
			},
			sv: {
				one: 'i = 1 and v = 0'
			},
			sw: {
				one: 'i = 1 and v = 0'
			},
			syr: {
				one: 'n = 1'
			},
			ta: {
				one: 'n = 1'
			},
			te: {
				one: 'n = 1'
			},
			teo: {
				one: 'n = 1'
			},
			th: {},
			ti: {
				one: 'n = 0..1'
			},
			tig: {
				one: 'n = 1'
			},
			tk: {
				one: 'n = 1'
			},
			tl: {
				one: 'v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9'
			},
			tn: {
				one: 'n = 1'
			},
			to: {},
			tr: {
				one: 'n = 1'
			},
			ts: {
				one: 'n = 1'
			},
			tzm: {
				one: 'n = 0..1 or n = 11..99'
			},
			ug: {
				one: 'n = 1'
			},
			uk: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14'
			},
			ur: {
				one: 'i = 1 and v = 0'
			},
			uz: {
				one: 'n = 1'
			},
			ve: {
				one: 'n = 1'
			},
			vi: {},
			vo: {
				one: 'n = 1'
			},
			vun: {
				one: 'n = 1'
			},
			wa: {
				one: 'n = 0..1'
			},
			wae: {
				one: 'n = 1'
			},
			wo: {},
			xh: {
				one: 'n = 1'
			},
			xog: {
				one: 'n = 1'
			},
			yi: {
				one: 'i = 1 and v = 0'
			},
			yo: {},
			yue: {},
			zh: {},
			zu: {
				one: 'i = 0 or n = 1'
			}
		},
		// jscs:enable

		/**
		 * Plural form transformations, needed for some languages.
		 *
		 * @param {integer} count
		 *            Non-localized quantifier
		 * @param {Array} forms
		 *            List of plural forms
		 * @return {string} Correct form for quantifier in this language
		 */
		convertPlural: function ( count, forms ) {
			var pluralRules,
				pluralFormIndex,
				index,
				explicitPluralPattern = new RegExp( '\\d+=', 'i' ),
				formCount,
				form;

			if ( !forms || forms.length === 0 ) {
				return '';
			}

			// Handle for Explicit 0= & 1= values
			for ( index = 0; index < forms.length; index++ ) {
				form = forms[ index ];
				if ( explicitPluralPattern.test( form ) ) {
					formCount = parseInt( form.slice( 0, form.indexOf( '=' ) ), 10 );
					if ( formCount === count ) {
						return ( form.slice( form.indexOf( '=' ) + 1 ) );
					}
					forms[ index ] = undefined;
				}
			}

			forms = $.map( forms, function ( form ) {
				if ( form !== undefined ) {
					return form;
				}
			} );

			pluralRules = this.pluralRules[ $.i18n().locale ];

			if ( !pluralRules ) {
				// default fallback.
				return ( count === 1 ) ? forms[ 0 ] : forms[ 1 ];
			}

			pluralFormIndex = this.getPluralForm( count, pluralRules );
			pluralFormIndex = Math.min( pluralFormIndex, forms.length - 1 );

			return forms[ pluralFormIndex ];
		},

		/**
		 * For the number, get the plural for index
		 *
		 * @param {integer} number
		 * @param {Object} pluralRules
		 * @return {integer} plural form index
		 */
		getPluralForm: function ( number, pluralRules ) {
			var i,
				pluralForms = [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
				pluralFormIndex = 0;

			for ( i = 0; i < pluralForms.length; i++ ) {
				if ( pluralRules[ pluralForms[ i ] ] ) {
					if ( pluralRuleParser( pluralRules[ pluralForms[ i ] ], number ) ) {
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
		 * @return {string} The number converted into a String.
		 */
		convertNumber: function ( num, integer ) {
			var tmp, item, i,
				transformTable, numberString, convertedNumber;

			// Set the target Transform table:
			transformTable = this.digitTransformTable( $.i18n().locale );
			numberString = String( num );
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
					tmp[ transformTable[ item ] ] = item;
				}

				transformTable = tmp;
			}

			for ( i = 0; i < numberString.length; i++ ) {
				if ( transformTable[ numberString[ i ] ] ) {
					convertedNumber += transformTable[ numberString[ i ] ];
				} else {
					convertedNumber += numberString[ i ];
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
		 * @param {string} word
		 * @param {string} form
		 * @return {string}
		 */
		// eslint-disable-next-line no-unused-vars
		convertGrammar: function ( word, form ) {
			return word;
		},

		/**
		 * Provides an alternative text depending on specified gender. Usage
		 * {{gender:[gender|user object]|masculine|feminine|neutral}}. If second
		 * or third parameter are not specified, masculine is used.
		 *
		 * These details may be overriden per language.
		 *
		 * @param {string} gender
		 *      male, female, or anything else for neutral.
		 * @param {Array} forms
		 *      List of gender forms
		 *
		 * @return {string}
		 */
		gender: function ( gender, forms ) {
			if ( !forms || forms.length === 0 ) {
				return '';
			}

			while ( forms.length < 2 ) {
				forms.push( forms[ forms.length - 1 ] );
			}

			if ( gender === 'male' ) {
				return forms[ 0 ];
			}

			if ( gender === 'female' ) {
				return forms[ 1 ];
			}

			return ( forms.length === 3 ) ? forms[ 2 ] : forms[ 0 ];
		},

		/**
		 * Get the digit transform table for the given language
		 * See http://cldr.unicode.org/translation/numbering-systems
		 *
		 * @param {string} language
		 * @return {Array|boolean} List of digits in the passed language or false
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
				th: '๐๑๒๓๔๕๖๗๘๙', // FIXME use iso 639 codes
				bo: '༠༡༢༣༤༥༦༧༨༩' // FIXME use iso 639 codes
			};

			if ( !tables[ language ] ) {
				return false;
			}

			return tables[ language ].split( '' );
		}
	};

	$.extend( $.i18n.languages, {
		'default': language
	} );
}( jQuery ) );
