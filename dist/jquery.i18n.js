/**
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var nav,
		slice = Array.prototype.slice;
	/**
	 * @constructor
	 * @param {Object} options
	 */
	var I18N = function ( options ) {
		// Load defaults
		this.options = $.extend( {}, I18N.defaults, options );

		this.parser = this.options.parser;
		this.locale = this.options.locale;
		this.messageStore = this.options.messageStore;
		this.languages = {};

		this.init();
	};

	I18N.prototype = {
		/**
		 * Initialize by loading locales and setting up
		 * String.prototype.toLocaleString and String.locale.
		 */
		init: function () {
			var i18n;

			i18n = this;
			i18n.messageStore.init( i18n.locale );
			// Set locale of String environment
			String.locale = i18n.locale;

			// Override String.localeString method
			String.prototype.toLocaleString = function () {
				var localeParts, messageLocation, localePartIndex, value, locale, fallbackIndex;

				value = this.valueOf();
				locale = i18n.locale;
				fallbackIndex = 0;

				while ( locale ) {
					// Iterate through locales starting at most-specific until
					// localization is found. As in fi-Latn-FI, fi-Latn and fi.
					localeParts = locale.toLowerCase().split( '-' );
					localePartIndex = localeParts.length;

					do {
						var _locale = localeParts.slice( 0, localePartIndex ).join( '-' );

						if ( i18n.options.messageLocationResolver ) {
							messageLocation = i18n.options.messageLocationResolver( _locale, value );

							if ( messageLocation &&
								( !i18n.messageStore.isLoaded( _locale ,messageLocation ) )
							) {
								i18n.messageStore.load( messageLocation, _locale );
							}
						}

						var message = i18n.messageStore.get( _locale, value );

						if ( message ) {
							return message;
						}

						localePartIndex--;
					} while ( localePartIndex );

					if ( locale === 'en' ) {
						break;
					}

					locale = ( $.i18n.fallbacks[i18n.locale] && $.i18n.fallbacks[i18n.locale][fallbackIndex] ) ||
						i18n.options.fallbackLocale;
					i18n.log( 'Trying fallback locale for ' + i18n.locale + ': ' + locale );

					fallbackIndex++;
				}

				// fallback the original string value
				return value;
			};
		},

		/*
		 * Destroy the i18n instance.
		 */
		destroy: function () {
			$.removeData( document, 'i18n' );
		},

		/**
		 * General message loading API This can take a URL string for
		 * the json formatted messages.
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * This can also load a localization file for a locale <code>
		 * load('path/to/de-messages.json', 'de' );
		 * </code>
		 * A data object containing message key- message translation mappings
		 * can also be passed Eg:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code> If the data argument is
		 * null/undefined/false,
		 * all cached messages for the i18n instance will get reset.
		 *
		 * @param {String|Object|null} data
		 * @param {String} locale Language tag
		 */
		load: function ( data, locale ) {
			this.messageStore.load( data, locale );
		},

		log: function ( /* arguments */ ) {
			if ( window.console && $.i18n.debug ) {
				window.console.log.apply( window.console, arguments );
			}
		},

		/**
		* Does parameter and magic word substitution.
		*
		* @param {string} key Message key
		* @param {Array} parameters Message parameters
		* @return {string}
		*/
		parse: function ( key, parameters ) {
			var message = key.toLocaleString();
			// FIXME: This changes the state of the I18N object,
			// should probably not change the 'this.parser' but just
			// pass it to the parser.
			this.parser.language = $.i18n.languages[$.i18n().locale] || $.i18n.languages['default'];
			return this.parser.parse( message, parameters );
		}
	};


	/**
	* Process a message from the $.I18N instance
	* for the current document, stored in jQuery.data(document).
	*
	* @param {string} key Key of the message.
	* @param {string} param1 [param...] Variadic list of parameters for {key}.
	* @return {string|$.I18N} Parsed message, or if no key was given
	* the instance of $.I18N is returned.
	*/
	$.i18n = function ( key, param1 ) {
		var parameters,
			i18n = $.data( document, 'i18n' ),
			options = typeof key === 'object' && key;

		// If the locale option for this call is different then the setup so far,
		// update it automatically. This doesn't just change the context for this
		// call but for all future call as well.
		// If there is no i18n setup yet, don't do this. It will be taken care of
		// by the `new I18N` construction below.
		// NOTE: It should only change language for this one call.
		// Then cache instances of I18N somewhere.
		if ( options && options.locale && i18n && i18n.locale !== options.locale ) {
			String.locale = i18n.locale = options.locale;
		}

		if ( !i18n ) {
			i18n = new I18N( options );
			$.data( document, 'i18n', i18n );
		}

		if ( typeof key === 'string' ) {
			if ( param1 !== undefined ) {
				parameters = slice.call( arguments, 1 );
			} else {
				parameters = [];
			}

			return i18n.parse( key, parameters );
		} else {
			// FIXME: remove this feature/bug.
			return i18n;
		}
	};


	$.fn.i18n = function () {
		return this.each( function () {
			var $this = $( this );

			if ( $this.data( 'i18n' ) ) {
				var messageKey = $this.data( 'i18n' ),
					message = $.i18n( messageKey );

				if ( message !== messageKey ) {
					$this.text( message );
				}
			} else {
				$this.find( '[data-i18n]' ).i18n();
			}
		} );
	};

	String.locale = String.locale || $( 'html' ).attr( 'lang' );

	if ( !String.locale ) {
		if ( typeof window.navigator !== undefined ) {
			nav = window.navigator;
			String.locale = nav.language || nav.userLanguage || '';
		} else {
			String.locale = '';
		}
	}

	$.i18n.languages = {};
	$.i18n.messageStore = $.i18n.messageStore || {};
	$.i18n.parser = {
		// The default parser only handles variable substitution
		parse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;
				return parameters[index] !== undefined ? parameters[index] : '$' + match;
			} );
		},
		emitter: {}
	};

	$.i18n.debug = false;

	/* Static members */
	I18N.defaults = {
		locale: String.locale,
		fallbackLocale: 'en',
		parser: $.i18n.parser,
		messageStore: $.i18n.messageStore,
		/* messageLocationResolver - should be a function taking language code as argument and
		 * returning absolute or relative path to the localization file
		 */
		messageLocationResolver: null
	};

	// Expose constructor
	$.I18N = I18N;
}( jQuery ) );

/**
 * jQuery Internationalization library Message loading , parsing, retrieving utilities
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $, window, undefined ) {
	'use strict';

	var MessageStore = function () {
		this.messages = {};
		this.sources = {};
		this.locale = String.locale;
	};

	MessageStore.prototype = {

		/**
		 * See https://github.com/wikimedia/jquery.i18n/wiki/Specification#wiki-Message_File_Loading
		 *
		 * @param locale
		 */
		init: function ( locale ) {
			var messageStore = this;

			messageStore.locale = locale;
			messageStore.log( 'initializing for ' + locale );

			$( 'link' ).each( function ( index, element ) {
				var $link = $( element ),
					rel = ( $link.attr( 'rel' ) || '' ).toLowerCase().split( /\s+/ );

				if ( $.inArray( 'localizations', rel ) !== -1 ) {
					// multiple localizations
					messageStore.load( $link.attr( 'href' ) );
				} else if ( $.inArray( 'localization', rel ) !== -1 ) {
					// single localization
					messageStore.queue( ( $link.attr( 'hreflang' ) || '' ).toLowerCase(),
						$link.attr( 'href' ) );
				}
			} );
		},

		/**
		 * General message loading API This can take a URL string for
		 * the json formatted messages.
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * This can also load a localization file for a locale <code>
		 * load('path/to/de-messages.json', 'de' );
		 * </code>
		 * A data object containing message key- message translation mappings
		 * can also be passed Eg:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code> If the data argument is
		 * null/undefined/false,
		 * all cached messages for the i18n instance will get reset.
		 *
		 * @param {String|Object|null} data
		 * @param {String} locale Language tag
		 */
		load: function ( data, locale ) {
			var key = null,
				messageStore = this,
				hasOwn = Object.prototype.hasOwnProperty;

			if ( !data ) {
				// reset all localizations
				messageStore.log( 'Resetting for locale ' + locale );
				messageStore.messages = {};

				return;
			}

			if ( typeof data === 'string' ) {
				// This is a URL to the messages file.
				messageStore.log( 'Loading messages from: ' + data );

				messageStore.jsonMessageLoader( data ).done( function ( localization, textStatus ) {
					messageStore.load( localization, locale );
					messageStore.queue( locale, data );
					messageStore.markLoaded( locale, data );
				} );
			} else {
				// Data is either a group of messages for {locale},
				// or a group of languages with groups of messages inside.
				for ( key in data ) {
					if ( hasOwn.call( data, key ) ) {
						if ( locale ) {

							// Lazy-init the object
							if ( !messageStore.messages[locale] ) {
								messageStore.messages[locale] = {};
							}

							// Update message object keys,
							// don't overwrite the entire object.
							messageStore.messages[locale][key] = data[key];

							messageStore.log(
								'[' + locale + '][' + key + '] : ' + data[key]
							);

							// No {locale} given, assume data is a group of languages,
							// call this function again for each langauge.
						} else {
							messageStore.load( data[key], key );
						}
					}
				}
			}
		},

		log: function ( /* arguments */ ) {
			if ( window.console && $.i18n.debug ) {
				window.console.log.apply( window.console, arguments );
			}
		},

		/**
		 * Mark a message Location for a locale loaded
		 *
		 * @param locale
		 * @param messageLocation
		 */
		markLoaded: function ( locale, messageLocation ) {
			var i,
				queue = this.sources[locale];

			if ( !queue ) {
				this.queue( locale, messageLocation );
				queue = this.sources[locale];
			}

			this.sources[locale] = this.sources[locale] || [];

			for ( i = 0; i < queue.length; i++ ) {
				if ( queue[i].source.url === messageLocation ) {
					queue[i].source.loaded = true;

					return;
				}
			}
		},

		/**
		 * Register the message location for a locale, will be loaded when required
		 *
		 * @param locale
		 * @param messageLocation
		 */
		queue: function ( locale, messageLocation ) {
			var i,
				queue = this.sources[locale];

			this.sources[locale] = this.sources[locale] || [];

			if ( queue ) {
				for ( i = 0; i < queue.length; i++ ) {
					if ( queue[i].source.url === messageLocation ) {
						return;
					}
				}
			}

			this.log( 'Source for: ' + locale + ' is ' + messageLocation + ' registered' );
			this.sources[locale].push( {
				source: {
					url: messageLocation,
					loaded: false
				}
			} );
		},

		/**
		 * Load the messages from the source queue for the locale
		 *
		 * @param {String} locale
		 */
		loadFromQueue: function ( locale ) {
			var i,
				queue = this.sources[locale];

			if ( queue ) {
				for ( i = 0; i < queue.length; i++ ) {
					if ( !queue[i].source.loaded ) {
						this.load( queue[i].source.url, locale );
						this.sources[locale][i].source.loaded = true;
					}
				}
			}
		},

		isLoaded: function ( locale, messageLocation ) {
			var i,
				sources = this.sources[locale],
				result = false;

			if ( sources ) {
				for ( i = 0; i < sources.length; i++ ) {
					if ( sources[i].source.url === messageLocation ) {
						result = true;
					}
				}
			}

			return result;
		},

		jsonMessageLoader: function ( url ) {
			var messageStore = this;

			return $.ajax( {
				url: url,
				dataType: 'json',
				async: false
			// This is unfortunate.
			} ).fail( function ( jqxhr, settings, exception ) {
				messageStore.log( 'Error in loading messages from ' + url + ' Exception: ' + exception );
			} );
		},

		/**
		 *
		 * @param locale
		 * @param messageKey
		 * @returns {Boolean}
		 */
		get: function ( locale, messageKey ) {
			// load locale if not loaded
			if ( !this.messages[locale] ) {
				this.loadFromQueue( locale );
			}

			return this.messages[locale] && this.messages[locale][messageKey];
		}
	};

	$.extend( $.i18n.messageStore, new MessageStore() );

}( jQuery, window ) );

/**
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */
( function ( $, undefined ) {
	'use strict';

	$.i18n = $.i18n || {};
	$.i18n.fallbacks = {
		'ab': ['ru'],
		'ace': ['id'],
		'aln': ['sq'],
		// Not so standard - als is supposed to be Tosk Albanian,
		// but in Wikipedia it's used for a Germanic language.
		'als': ['gsw', 'de'],
		'an': ['es'],
		'anp': ['hi'],
		'arn': ['es'],
		'arz': ['ar'],
		'av': ['ru'],
		'ay': ['es'],
		'ba': ['ru'],
		'bar': ['de'],
		'bat-smg': ['sgs', 'lt'],
		'bcc': ['fa'],
		'be-x-old': ['be-tarask'],
		'bh': ['bho'],
		'bjn': ['id'],
		'bm': ['fr'],
		'bpy': ['bn'],
		'bqi': ['fa'],
		'bug': ['id'],
		'cbk-zam': ['es'],
		'ce': ['ru'],
		'crh': ['crh-latn'],
		'crh-cyrl': ['ru'],
		'csb': ['pl'],
		'cv': ['ru'],
		'de-at': ['de'],
		'de-ch': ['de'],
		'de-formal': ['de'],
		'dsb': ['de'],
		'dtp': ['ms'],
		'egl': ['it'],
		'eml': ['it'],
		'ff': ['fr'],
		'fit': ['fi'],
		'fiu-vro': ['vro', 'et'],
		'frc': ['fr'],
		'frp': ['fr'],
		'frr': ['de'],
		'fur': ['it'],
		'gag': ['tr'],
		'gan': ['gan-hant', 'zh-hant', 'zh-hans'],
		'gan-hans': ['zh-hans'],
		'gan-hant': ['zh-hant', 'zh-hans'],
		'gl': ['pt'],
		'glk': ['fa'],
		'gn': ['es'],
		'gsw': ['de'],
		'hif': ['hif-latn'],
		'hsb': ['de'],
		'ht': ['fr'],
		'ii': ['zh-cn', 'zh-hans'],
		'inh': ['ru'],
		'iu': ['ike-cans'],
		'jut': ['da'],
		'jv': ['id'],
		'kaa': ['kk-latn', 'kk-cyrl'],
		'kbd': ['kbd-cyrl'],
		'khw': ['ur'],
		'kiu': ['tr'],
		'kk': ['kk-cyrl'],
		'kk-arab': ['kk-cyrl'],
		'kk-latn': ['kk-cyrl'],
		'kk-cn': ['kk-arab', 'kk-cyrl'],
		'kk-kz': ['kk-cyrl'],
		'kk-tr': ['kk-latn', 'kk-cyrl'],
		'kl': ['da'],
		'ko-kp': ['ko'],
		'koi': ['ru'],
		'krc': ['ru'],
		'ks': ['ks-arab'],
		'ksh': ['de'],
		'ku': ['ku-latn'],
		'ku-arab': ['ckb'],
		'kv': ['ru'],
		'lad': ['es'],
		'lb': ['de'],
		'lbe': ['ru'],
		'lez': ['ru'],
		'li': ['nl'],
		'lij': ['it'],
		'liv': ['et'],
		'lmo': ['it'],
		'ln': ['fr'],
		'ltg': ['lv'],
		'lzz': ['tr'],
		'mai': ['hi'],
		'map-bms': ['jv', 'id'],
		'mg': ['fr'],
		'mhr': ['ru'],
		'min': ['id'],
		'mo': ['ro'],
		'mrj': ['ru'],
		'mwl': ['pt'],
		'myv': ['ru'],
		'mzn': ['fa'],
		'nah': ['es'],
		'nap': ['it'],
		'nds': ['de'],
		'nds-nl': ['nl'],
		'nl-informal': ['nl'],
		'no': ['nb'],
		'os': ['ru'],
		'pcd': ['fr'],
		'pdc': ['de'],
		'pdt': ['de'],
		'pfl': ['de'],
		'pms': ['it'],
		'pt': ['pt-br'],
		'pt-br': ['pt'],
		'qu': ['es'],
		'qug': ['qu', 'es'],
		'rgn': ['it'],
		'rmy': ['ro'],
		'roa-rup': ['rup'],
		'rue': ['uk', 'ru'],
		'ruq': ['ruq-latn', 'ro'],
		'ruq-cyrl': ['mk'],
		'ruq-latn': ['ro'],
		'sa': ['hi'],
		'sah': ['ru'],
		'scn': ['it'],
		'sg': ['fr'],
		'sgs': ['lt'],
		'sli': ['de'],
		'sr': ['sr-ec'],
		'srn': ['nl'],
		'stq': ['de'],
		'su': ['id'],
		'szl': ['pl'],
		'tcy': ['kn'],
		'tg': ['tg-cyrl'],
		'tt': ['tt-cyrl', 'ru'],
		'tt-cyrl': ['ru'],
		'ty': ['fr'],
		'udm': ['ru'],
		'ug': ['ug-arab'],
		'uk': ['ru'],
		'vec': ['it'],
		'vep': ['et'],
		'vls': ['nl'],
		'vmf': ['de'],
		'vot': ['fi'],
		'vro': ['et'],
		'wa': ['fr'],
		'wo': ['fr'],
		'wuu': ['zh-hans'],
		'xal': ['ru'],
		'xmf': ['ka'],
		'yi': ['he'],
		'za': ['zh-hans'],
		'zea': ['nl'],
		'zh': ['zh-hans'],
		'zh-classical': ['lzh'],
		'zh-cn': ['zh-hans'],
		'zh-hant': ['zh-hans'],
		'zh-hk': ['zh-hant', 'zh-hans'],
		'zh-min-nan': ['nan'],
		'zh-mo': ['zh-hk', 'zh-hant', 'zh-hans'],
		'zh-my': ['zh-sg', 'zh-hans'],
		'zh-sg': ['zh-hans'],
		'zh-tw': ['zh-hant', 'zh-hans'],
		'zh-yue': ['yue']
	};
}( jQuery ) );

/**
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageParser = function ( options ) {
		this.options = $.extend( {}, $.i18n.parser.defaults, options );
		this.language = $.i18n.languages[String.locale] || $.i18n.languages['default'];
		this.emitter = $.i18n.parser.emitter;
	};

	MessageParser.prototype = {

		constructor: MessageParser,

		simpleParse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;

				return parameters[index] !== undefined ? parameters[index] : '$' + match;
			} );
		},

		parse: function ( message, replacements ) {
			if ( message.indexOf( '{{' ) < 0 ) {
				return this.simpleParse( message, replacements );
			}

			this.emitter.language = $.i18n.languages[$.i18n().locale] ||
				$.i18n.languages['default'];

			return this.emitter.emit( this.ast( message ), replacements );
		},

		ast: function ( message ) {
			var pos = 0;

			// Try parsers until one works, if none work return null
			function choice ( parserSyntax ) {
				return function () {
					var i, result;

					for ( i = 0; i < parserSyntax.length; i++ ) {
						result = parserSyntax[i]();

						if ( result !== null ) {
							return result;
						}
					}

					return null;
				};
			}

			// Try several parserSyntax-es in a row.
			// All must succeed; otherwise, return null.
			// This is the only eager one.
			function sequence ( parserSyntax ) {
				var i, res,
					originalPos = pos,
					result = [];

				for ( i = 0; i < parserSyntax.length; i++ ) {
					res = parserSyntax[i]();

					if ( res === null ) {
						pos = originalPos;

						return null;
					}

					result.push( res );
				}

				return result;
			}

			// Run the same parser over and over until it fails.
			// Must succeed a minimum of n times; otherwise, return null.
			function nOrMore ( n, p ) {
				return function () {
					var originalPos = pos,
						result = [],
						parsed = p();

					while ( parsed !== null ) {
						result.push( parsed );
						parsed = p();
					}

					if ( result.length < n ) {
						pos = originalPos;

						return null;
					}

					return result;
				};
			}

			// Helpers -- just make parserSyntax out of simpler JS builtin types

			function makeStringParser ( s ) {
				var len = s.length;

				return function () {
					var result = null;

					if ( message.substr( pos, len ) === s ) {
						result = s;
						pos += len;
					}

					return result;
				};
			}

			function makeRegexParser ( regex ) {
				return function () {
					var matches = message.substr( pos ).match( regex );

					if ( matches === null ) {
						return null;
					}

					pos += matches[0].length;

					return matches[0];
				};
			}

			var pipe = makeStringParser( '|' );
			var colon = makeStringParser( ':' );
			var backslash = makeStringParser( '\\' );
			var anyCharacter = makeRegexParser( /^./ );
			var dollar = makeStringParser( '$' );
			var digits = makeRegexParser( /^\d+/ );
			var regularLiteral = makeRegexParser( /^[^{}\[\]$\\]/ );
			var regularLiteralWithoutBar = makeRegexParser( /^[^{}\[\]$\\|]/ );
			var regularLiteralWithoutSpace = makeRegexParser( /^[^{}\[\]$\s]/ );

			// There is a general pattern:
			// parse a thing;
			// if it worked, apply transform,
			// otherwise return null.
			// But using this as a combinator seems to cause problems
			// when combined with nOrMore().
			// May be some scoping issue.
			function transform ( p, fn ) {
				return function () {
					var result = p();

					return result === null ? null : fn( result );
				};
			}

			// Used to define "literals" within template parameters. The pipe
			// character is the parameter delimeter, so by default
			// it is not a literal in the parameter
			function literalWithoutBar () {
				var result = nOrMore( 1, escapedOrLiteralWithoutBar )();

				return result === null ? null : result.join( '' );
			}

			function literal () {
				var result = nOrMore( 1, escapedOrRegularLiteral )();

				return result === null ? null : result.join( '' );
			}

			function escapedLiteral () {
				var result = sequence( [ backslash, anyCharacter ] );

				return result === null ? null : result[1];
			}

			choice( [ escapedLiteral, regularLiteralWithoutSpace ] );
			var escapedOrLiteralWithoutBar = choice( [ escapedLiteral, regularLiteralWithoutBar ] );
			var escapedOrRegularLiteral = choice( [ escapedLiteral, regularLiteral ] );

			function replacement () {
				var result = sequence( [ dollar, digits ] );

				if ( result === null ) {
					return null;
				}

				return [ 'REPLACE', parseInt( result[1], 10 ) - 1 ];
			}

			var templateName = transform(
				// see $wgLegalTitleChars
				// not allowing : due to the need to catch "PLURAL:$1"
				makeRegexParser( /^[ !"$&'()*,.\/0-9;=?@A-Z\^_`a-z~\x80-\xFF+\-]+/ ),

				function ( result ) {
					return result.toString();
				}
			);

			function templateParam () {
				var result = sequence( [ pipe, nOrMore( 0, paramExpression ) ] );

				if ( result === null ) {
					return null;
				}

				var expr = result[1];

				// use a "CONCAT" operator if there are multiple nodes,
				// otherwise return the first node, raw.
				return expr.length > 1 ? [ 'CONCAT' ].concat( expr ) : expr[0];
			}

			function templateWithReplacement () {
				var result = sequence( [ templateName, colon, replacement ] );

				return result === null ? null : [ result[0], result[2] ];
			}

			function templateWithOutReplacement () {
				var result = sequence( [ templateName, colon, paramExpression ] );

				return result === null ? null : [ result[0], result[2] ];
			}

			var templateContents = choice( [
				function () {
					var res = sequence( [
						// templates can have placeholders for dynamic
						// replacement eg: {{PLURAL:$1|one car|$1 cars}}
						// or no placeholders eg:
						// {{GRAMMAR:genitive|{{SITENAME}}}
						choice( [ templateWithReplacement, templateWithOutReplacement ] ),
						nOrMore( 0, templateParam )
					] );

					return res === null ? null : res[0].concat( res[1] );
				},
				function () {
					var res = sequence( [ templateName, nOrMore( 0, templateParam ) ] );

					if ( res === null ) {
						return null;
					}

					return [ res[0] ].concat( res[1] );
				}
			] );

			var openTemplate = makeStringParser( '{{' );
			var closeTemplate = makeStringParser( '}}' );

			function template () {
				var result = sequence( [ openTemplate, templateContents, closeTemplate ] );

				return result === null ? null : result[1];
			}

			var expression = choice( [ template, replacement, literal ] );
			var paramExpression = choice( [ template, replacement, literalWithoutBar ] );

			function start () {
				var result = nOrMore( 0, expression )();

				if ( result === null ) {
					return null;
				}

				return [ 'CONCAT' ].concat( result );
			}

			var result = start();

			/*
			 * For success, the pos must have gotten to the end of the input
			 * and returned a non-null.
			 * n.b. This is part of language infrastructure, so we do not throw an internationalizable message.
			 */
			if ( result === null || pos !== message.length ) {
				throw new Error( 'Parse error at position ' + pos.toString() + ' in input: ' + message );
			}

			return result;
		}

	};

	$.extend( $.i18n.parser, new MessageParser() );

}( jQuery ) );

/**
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageParserEmitter = function () {
		this.language = $.i18n.languages[String.locale] || $.i18n.languages['default'];
	};

	MessageParserEmitter.prototype = {
		constructor: MessageParserEmitter,

		/**
		 * (We put this method definition here, and not in prototype, to make
		 * sure it's not overwritten by any magic.) Walk entire node structure,
		 * applying replacements and template functions when appropriate
		 *
		 * @param {Mixed} node abstract syntax tree (top node or subnode)
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {Mixed} single-string node or array of nodes suitable for
		 *  jQuery appending.
		 */
		emit: function ( node, replacements ) {
			var ret, subnodes, operation,
				messageParserEmitter = this;

			switch ( typeof node ) {
			case 'string':
			case 'number':
				ret = node;
				break;
			case 'object':
				// node is an array of nodes
				subnodes = $.map( node.slice( 1 ), function ( n ) {
					return messageParserEmitter.emit( n, replacements );
				} );

				operation = node[0].toLowerCase();

				if ( typeof messageParserEmitter[operation] === 'function' ) {
					ret = messageParserEmitter[operation]( subnodes, replacements );
				} else {
					throw new Error( 'unknown operation "' + operation + '"' );
				}

				break;
			case 'undefined':
				// Parsing the empty string (as an entire expression, or as a
				// paramExpression in a template) results in undefined
				// Perhaps a more clever parser can detect this, and return the
				// empty string? Or is that useful information?
				// The logical thing is probably to return the empty string here
				// when we encounter undefined.
				ret = '';
				break;
			default:
				throw new Error( 'unexpected type in AST: ' + typeof node );
			}

			return ret;
		},

		/**
		 * Parsing has been applied depth-first we can assume that all nodes
		 * here are single nodes Must return a single node to parents -- a
		 * jQuery with synthetic span However, unwrap any other synthetic spans
		 * in our children and pass them upwards
		 *
		 * @param {Array} nodes Mixed, some single nodes, some arrays of nodes.
		 * @return String
		 */
		concat: function ( nodes ) {
			var result = '';

			$.each( nodes, function ( i, node ) {
				// strings, integers, anything else
				result += node;
			} );

			return result;
		},

		/**
		 * Return escaped replacement of correct index, or string if
		 * unavailable. Note that we expect the parsed parameter to be
		 * zero-based. i.e. $1 should have become [ 0 ]. if the specified
		 * parameter is not found return the same string (e.g. "$99" ->
		 * parameter 98 -> not found -> return "$99" ) TODO throw error if
		 * nodes.length > 1 ?
		 *
		 * @param {Array} nodes One element, integer, n >= 0
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {string} replacement
		 */
		replace: function ( nodes, replacements ) {
			var index = parseInt( nodes[0], 10 );

			if ( index < replacements.length ) {
				// replacement is not a string, don't touch!
				return replacements[index];
			} else {
				// index not found, fallback to displaying variable
				return '$' + ( index + 1 );
			}
		},

		/**
		 * Transform parsed structure into pluralization n.b. The first node may
		 * be a non-integer (for instance, a string representing an Arabic
		 * number). So convert it back with the current language's
		 * convertNumber.
		 *
		 * @param {Array} nodes List [ {String|Number}, {String}, {String} ... ]
		 * @return {String} selected pluralized form according to current
		 *  language.
		 */
		plural: function ( nodes ) {
			var count = parseFloat( this.language.convertNumber( nodes[0], 10 ) ),
				forms = nodes.slice( 1 );

			return forms.length ? this.language.convertPlural( count, forms ) : '';
		},

		/**
		 * Transform parsed structure into gender Usage
		 * {{gender:gender|masculine|feminine|neutral}}.
		 *
		 * @param {Array} nodes List [ {String}, {String}, {String} , {String} ]
		 * @return {String} selected gender form according to current language
		 */
		gender: function ( nodes ) {
			var gender = nodes[0],
				forms = nodes.slice( 1 );

			return this.language.gender( gender, forms );
		},

		/**
		 * Transform parsed structure into grammar conversion. Invoked by
		 * putting {{grammar:form|word}} in a message
		 *
		 * @param {Array} nodes List [{Grammar case eg: genitive}, {String word}]
		 * @return {String} selected grammatical form according to current
		 *  language.
		 */
		grammar: function ( nodes ) {
			var form = nodes[0],
				word = nodes[1];

			return word && form && this.language.convertGrammar( word, form );
		}
	};

	$.extend( $.i18n.parser.emitter, new MessageParserEmitter() );

}( jQuery ) );

/*global pluralRuleParser */
( function ( $ ) {
	'use strict';

	var language = {

		// CLDR plural rules generated using
		// http://i18ndata.appspot.com/cldr/tags/unconfirmed/supplemental/plurals?action=browse&depth=-1
		// and compressed
		pluralRules: {
			gv: {
				one: 'n mod 10 in 1..2 or n mod 20 is 0'
			},
			gu: {
				one: 'n is 1'
			},
			rof: {
				one: 'n is 1'
			},
			ga: {
				few: 'n in 3..6',
				many: 'n in 7..10',
				two: 'n is 2',
				one: 'n is 1'
			},
			gl: {
				one: 'n is 1'
			},
			lg: {
				one: 'n is 1'
			},
			lb: {
				one: 'n is 1'
			},
			xog: {
				one: 'n is 1'
			},
			ln: {
				one: 'n in 0..1'
			},
			lo: '',
			brx: {
				one: 'n is 1'
			},
			tr: '',
			ts: {
				one: 'n is 1'
			},
			tn: {
				one: 'n is 1'
			},
			to: '',
			lt: {
				few: 'n mod 10 in 2..9 and n mod 100 not in 11..19',
				one: 'n mod 10 is 1 and n mod 100 not in 11..19'
			},
			tk: {
				one: 'n is 1'
			},
			th: '',
			ksb: {
				one: 'n is 1'
			},
			te: {
				one: 'n is 1'
			},
			ksh: {
				zero: 'n is 0',
				one: 'n is 1'
			},
			fil: {
				one: 'n in 0..1'
			},
			haw: {
				one: 'n is 1'
			},
			kcg: {
				one: 'n is 1'
			},
			ssy: {
				one: 'n is 1'
			},
			yo: '',
			de: {
				one: 'n is 1'
			},
			ko: '',
			da: {
				one: 'n is 1'
			},
			dz: '',
			dv: {
				one: 'n is 1'
			},
			guw: {
				one: 'n in 0..1'
			},
			shi: {
				few: 'n in 2..10',
				one: 'n within 0..1'
			},
			el: {
				one: 'n is 1'
			},
			eo: {
				one: 'n is 1'
			},
			en: {
				one: 'n is 1'
			},
			ses: '',
			teo: {
				one: 'n is 1'
			},
			ee: {
				one: 'n is 1'
			},
			kde: '',
			fr: {
				one: 'n within 0..2 and n is not 2'
			},
			eu: {
				one: 'n is 1'
			},
			et: {
				one: 'n is 1'
			},
			es: {
				one: 'n is 1'
			},
			seh: {
				one: 'n is 1'
			},
			ru: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			kl: {
				one: 'n is 1'
			},
			sms: {
				two: 'n is 2',
				one: 'n is 1'
			},
			smn: {
				two: 'n is 2',
				one: 'n is 1'
			},
			smj: {
				two: 'n is 2',
				one: 'n is 1'
			},
			smi: {
				two: 'n is 2',
				one: 'n is 1'
			},
			fy: {
				one: 'n is 1'
			},
			rm: {
				one: 'n is 1'
			},
			ro: {
				few: 'n is 0 OR n is not 1 AND n mod 100 in 1..19',
				one: 'n is 1'
			},
			bn: {
				one: 'n is 1'
			},
			sma: {
				two: 'n is 2',
				one: 'n is 1'
			},
			be: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			bg: {
				one: 'n is 1'
			},
			ms: '',
			wa: {
				one: 'n in 0..1'
			},
			ps: {
				one: 'n is 1'
			},
			wo: '',
			bm: '',
			jv: '',
			bo: '',
			bh: {
				one: 'n in 0..1'
			},
			kea: '',
			asa: {
				one: 'n is 1'
			},
			cgg: {
				one: 'n is 1'
			},
			br: {
				few: 'n mod 10 in 3..4,9 and n mod 100 not in 10..19,70..79,90..99',
				many: 'n mod 1000000 is 0 and n is not 0',
				two: 'n mod 10 is 2 and n mod 100 not in 12,72,92',
				one: 'n mod 10 is 1 and n mod 100 not in 11,71,91'
			},
			bs: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			ja: '',
			om: {
				one: 'n is 1'
			},
			fa: '',
			vun: {
				one: 'n is 1'
			},
			or: {
				one: 'n is 1'
			},
			xh: {
				one: 'n is 1'
			},
			nso: {
				one: 'n in 0..1'
			},
			ca: {
				one: 'n is 1'
			},
			cy: {
				few: 'n is 3',
				zero: 'n is 0',
				many: 'n is 6',
				two: 'n is 2',
				one: 'n is 1'
			},
			cs: {
				few: 'n in 2..4',
				one: 'n is 1'
			},
			zh: '',
			lv: {
				zero: 'n is 0',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			pt: {
				one: 'n is 1'
			},
			wae: {
				one: 'n is 1'
			},
			tl: {
				one: 'n in 0..1'
			},
			chr: {
				one: 'n is 1'
			},
			pa: {
				one: 'n is 1'
			},
			ak: {
				one: 'n in 0..1'
			},
			pl: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n is not 1 and n mod 10 in 0..1 or n mod 10 in 5..9 or n mod 100 in 12..14',
				one: 'n is 1'
			},
			hr: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			am: {
				one: 'n in 0..1'
			},
			ti: {
				one: 'n in 0..1'
			},
			hu: '',
			hi: {
				one: 'n in 0..1'
			},
			jmc: {
				one: 'n is 1'
			},
			ha: {
				one: 'n is 1'
			},
			he: {
				one: 'n is 1'
			},
			mg: {
				one: 'n in 0..1'
			},
			fur: {
				one: 'n is 1'
			},
			bem: {
				one: 'n is 1'
			},
			ml: {
				one: 'n is 1'
			},
			mo: {
				few: 'n is 0 OR n is not 1 AND n mod 100 in 1..19',
				one: 'n is 1'
			},
			mn: {
				one: 'n is 1'
			},
			mk: {
				one: 'n mod 10 is 1 and n is not 11'
			},
			ur: {
				one: 'n is 1'
			},
			bez: {
				one: 'n is 1'
			},
			mt: {
				few: 'n is 0 or n mod 100 in 2..10',
				many: 'n mod 100 in 11..19',
				one: 'n is 1'
			},
			uk: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			mr: {
				one: 'n is 1'
			},
			ta: {
				one: 'n is 1'
			},
			my: '',
			sah: '',
			ve: {
				one: 'n is 1'
			},
			af: {
				one: 'n is 1'
			},
			vi: '',
			is: {
				one: 'n is 1'
			},
			iu: {
				two: 'n is 2',
				one: 'n is 1'
			},
			it: {
				one: 'n is 1'
			},
			kn: '',
			ii: '',
			ar: {
				few: 'n mod 100 in 3..10',
				zero: 'n is 0',
				many: 'n mod 100 in 11..99',
				two: 'n is 2',
				one: 'n is 1'
			},
			zu: {
				one: 'n is 1'
			},
			saq: {
				one: 'n is 1'
			},
			az: '',
			tzm: {
				one: 'n in 0..1 or n in 11..99'
			},
			id: '',
			ig: '',
			pap: {
				one: 'n is 1'
			},
			nl: {
				one: 'n is 1'
			},
			nn: {
				one: 'n is 1'
			},
			no: {
				one: 'n is 1'
			},
			nah: {
				one: 'n is 1'
			},
			nd: {
				one: 'n is 1'
			},
			ne: {
				one: 'n is 1'
			},
			ny: {
				one: 'n is 1'
			},
			naq: {
				two: 'n is 2',
				one: 'n is 1'
			},
			nyn: {
				one: 'n is 1'
			},
			kw: {
				two: 'n is 2',
				one: 'n is 1'
			},
			nr: {
				one: 'n is 1'
			},
			tig: {
				one: 'n is 1'
			},
			kab: {
				one: 'n within 0..2 and n is not 2'
			},
			mas: {
				one: 'n is 1'
			},
			rwk: {
				one: 'n is 1'
			},
			kaj: {
				one: 'n is 1'
			},
			lag: {
				zero: 'n is 0',
				one: 'n within 0..2 and n is not 0 and n is not 2'
			},
			syr: {
				one: 'n is 1'
			},
			kk: {
				one: 'n is 1'
			},
			ff: {
				one: 'n within 0..2 and n is not 2'
			},
			fi: {
				one: 'n is 1'
			},
			fo: {
				one: 'n is 1'
			},
			ka: '',
			gsw: {
				one: 'n is 1'
			},
			ckb: {
				one: 'n is 1'
			},
			ss: {
				one: 'n is 1'
			},
			sr: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			sq: {
				one: 'n is 1'
			},
			sw: {
				one: 'n is 1'
			},
			sv: {
				one: 'n is 1'
			},
			km: '',
			st: {
				one: 'n is 1'
			},
			sk: {
				few: 'n in 2..4',
				one: 'n is 1'
			},
			sh: {
				few: 'n mod 10 in 2..4 and n mod 100 not in 12..14',
				many: 'n mod 10 is 0 or n mod 10 in 5..9 or n mod 100 in 11..14',
				one: 'n mod 10 is 1 and n mod 100 is not 11'
			},
			so: {
				one: 'n is 1'
			},
			sn: {
				one: 'n is 1'
			},
			ku: {
				one: 'n is 1'
			},
			sl: {
				few: 'n mod 100 in 3..4',
				two: 'n mod 100 is 2',
				one: 'n mod 100 is 1'
			},
			sg: '',
			nb: {
				one: 'n is 1'
			},
			se: {
				two: 'n is 2',
				one: 'n is 1'
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
				pluralFormIndex = 0,
				form;

			if ( !forms || forms.length === 0 ) {
				return '';
			}

			
			// Handle for Explicit 0= & 1= values
			for( var index = 0 ; index < forms.length ; index++ ) {
				form = forms[index];
				if( form[1] === "=" ) {
					if( +form[0] === count ) { // Explicit comparision
						return (form.substr( 2 ));
					}
					forms[index] = undefined;
				}
			}
			
			forms = $.map ( forms, function( form ){
				return form;
			});

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

/**
 * Bosnian (bosanski) language functions
 */
( function ( $ ) {
	'use strict';

	$.i18n.languages.bs = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
			case 'instrumental': // instrumental
				word = 's ' + word;
				break;
			case 'lokativ': // locative
				word = 'o ' + word;
				break;
			}

			return word;
		}
	} );

}( jQuery ) );

/**
 * Lower Sorbian (Dolnoserbski) language functions
 */
( function ( $ ) {
	'use strict';

	$.i18n.languages.dsb = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
				case 'instrumental': // instrumental
					word = 'z ' + word;
					break;
				case 'lokatiw': // lokatiw
					word = 'wo ' + word;
					break;
			}

			return word;
		}
	} );

}( jQuery ) );

/**
 * Finnish (Suomi) language functions
 *
 * @author Santhosh Thottingal
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.fi = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			// vowel harmony flag
			var aou = word.match( /[aou][^äöy]*$/i ),
				origWord = word;
			if ( word.match( /wiki$/i ) ) {
				aou = false;
			}

			// append i after final consonant
			if ( word.match( /[bcdfghjklmnpqrstvwxz]$/i ) ) {
				word += 'i';
			}

			switch ( form ) {
			case 'genitive':
				word += 'n';
				break;
			case 'elative':
				word += ( aou ? 'sta' : 'stä' );
				break;
			case 'partitive':
				word += ( aou ? 'a' : 'ä' );
				break;
			case 'illative':
				// Double the last letter and add 'n'
				word += word.substr( word.length - 1 ) + 'n';
				break;
			case 'inessive':
				word += ( aou ? 'ssa' : 'ssä' );
				break;
			default:
				word = origWord;
				break;
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Irish (Gaeilge) language functions
 */
( function ( $ ) {
	'use strict';

	$.i18n.languages.ga = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			if ( form === 'ainmlae' ) {
				switch ( word ) {
				case 'an Domhnach':
					word = 'Dé Domhnaigh';
					break;
				case 'an Luan':
					word = 'Dé Luain';
					break;
				case 'an Mháirt':
					word = 'Dé Mháirt';
					break;
				case 'an Chéadaoin':
					word = 'Dé Chéadaoin';
					break;
				case 'an Déardaoin':
					word = 'Déardaoin';
					break;
				case 'an Aoine':
					word = 'Dé hAoine';
					break;
				case 'an Satharn':
					word = 'Dé Sathairn';
					break;
				}
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Hebrew (עברית) language functions
 */
( function ( $ ) {
	'use strict';

	$.i18n.languages.he = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
			case 'prefixed':
			case 'תחילית': // the same word in Hebrew
				// Duplicate prefixed "Waw", but only if it's not already double
				if ( word.substr( 0, 1 ) === 'ו' && word.substr( 0, 2 ) !== 'וו' ) {
					word = 'ו' + word;
				}

				// Remove the "He" if prefixed
				if ( word.substr( 0, 1 ) === 'ה' ) {
					word = word.substr( 1, word.length );
				}

				// Add a hyphen (maqaf) before numbers and non-Hebrew letters
				if ( word.substr( 0, 1 ) < 'א' || word.substr( 0, 1 ) > 'ת' ) {
					word = '־' + word;
				}
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Upper Sorbian (Hornjoserbsce) language functions
 */
( function ( $ ) {
	'use strict';

	$.i18n.languages.hsb = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
			case 'instrumental': // instrumental
				word = 'z ' + word;
				break;
			case 'lokatiw': // lokatiw
				word = 'wo ' + word;
				break;
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Hungarian language functions
 *
 * @author Santhosh Thottingal
 */
( function ( $ ) {
	'use strict';

	$.i18n.languages.hu = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
			case 'rol':
				word += 'ról';
				break;
			case 'ba':
				word += 'ba';
				break;
			case 'k':
				word += 'k';
				break;
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Armenian (Հայերեն) language functions
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.hy = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			if ( form === 'genitive' ) { // սեռական հոլով
				if ( word.substr( -1 ) === 'ա' ) {
					word = word.substr( 0, word.length - 1 ) + 'այի';
				} else if ( word.substr( -1 ) === 'ո' ) {
					word = word.substr( 0, word.length - 1 ) + 'ոյի';
				} else if ( word.substr( -4 ) === 'գիրք' ) {
					word = word.substr( 0, word.length - 4 ) + 'գրքի';
				} else {
					word = word + 'ի';
				}
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Latin (lingua Latina) language functions
 *
 * @author Santhosh Thottingal
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.la = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
			case 'genitive':
				// only a few declensions, and even for those mostly the singular only
				word = word.replace( /u[ms]$/i, 'i' ); // 2nd declension singular
				word = word.replace( /ommunia$/i, 'ommunium' ); // 3rd declension neuter plural (partly)
				word = word.replace( /a$/i, 'ae' ); // 1st declension singular
				word = word.replace( /libri$/i, 'librorum' ); // 2nd declension plural (partly)
				word = word.replace( /nuntii$/i, 'nuntiorum' ); // 2nd declension plural (partly)
				word = word.replace( /tio$/i, 'tionis' ); // 3rd declension singular (partly)
				word = word.replace( /ns$/i, 'ntis' );
				word = word.replace( /as$/i, 'atis' );
				word = word.replace( /es$/i, 'ei' ); // 5th declension singular
				break;
			case 'accusative':
				// only a few declensions, and even for those mostly the singular only
				word = word.replace( /u[ms]$/i, 'um' ); // 2nd declension singular
				word = word.replace( /ommunia$/i, 'am' ); // 3rd declension neuter plural (partly)
				word = word.replace( /a$/i, 'ommunia' ); // 1st declension singular
				word = word.replace( /libri$/i, 'libros' ); // 2nd declension plural (partly)
				word = word.replace( /nuntii$/i, 'nuntios' );// 2nd declension plural (partly)
				word = word.replace( /tio$/i, 'tionem' ); // 3rd declension singular (partly)
				word = word.replace( /ns$/i, 'ntem' );
				word = word.replace( /as$/i, 'atem' );
				word = word.replace( /es$/i, 'em' ); // 5th declension singular
				break;
			case 'ablative':
				// only a few declensions, and even for those mostly the singular only
				word = word.replace( /u[ms]$/i, 'o' ); // 2nd declension singular
				word = word.replace( /ommunia$/i, 'ommunibus' ); // 3rd declension neuter plural (partly)
				word = word.replace( /a$/i, 'a' ); // 1st declension singular
				word = word.replace( /libri$/i, 'libris' ); // 2nd declension plural (partly)
				word = word.replace( /nuntii$/i, 'nuntiis' ); // 2nd declension plural (partly)
				word = word.replace( /tio$/i, 'tione' ); // 3rd declension singular (partly)
				word = word.replace( /ns$/i, 'nte' );
				word = word.replace( /as$/i, 'ate' );
				word = word.replace( /es$/i, 'e' ); // 5th declension singular
				break;
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Ossetian (Ирон) language functions
 *
 * @author Santhosh Thottingal
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.os = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			// Ending for allative case
			var endAllative = 'мæ';
			// Variable for 'j' beetwen vowels
			var jot = '';
			// Variable for "-" for not Ossetic words
			var hyphen = '';
			// Variable for ending
			var ending = '';
			// Checking if the $word is in plural form
			if ( word.match( /тæ$/i ) ) {
				word = word.substring( 0, word.length - 1 );
				endAllative = 'æм';
			}
			// Works if word is in singular form.
			// Checking if word ends on one of the vowels: е, ё, и, о, ы, э, ю,
			// я.
			else if ( word.match( /[аæеёиоыэюя]$/i ) ) {
				jot = 'й';
			}
			// Checking if word ends on 'у'. 'У' can be either consonant 'W' or
			// vowel 'U' in cyrillic Ossetic.
			// Examples: {{grammar:genitive|аунеу}} = аунеуы,
			// {{grammar:genitive|лæппу}} = лæппуйы.
			else if ( word.match( /у$/i ) ) {
				if ( !word.substring( word.length - 2, word.length - 1 )
						.match( /[аæеёиоыэюя]$/i ) ) {
					jot = 'й';
				}
			} else if ( !word.match( /[бвгджзйклмнопрстфхцчшщьъ]$/i ) ) {
				hyphen = '-';
			}

			switch ( form ) {
			case 'genitive':
				ending = hyphen + jot + 'ы';
				break;
			case 'dative':
				ending = hyphen + jot + 'æн';
				break;
			case 'allative':
				ending = hyphen + endAllative;
				break;
			case 'ablative':
				if ( jot === 'й' ) {
					ending = hyphen + jot + 'æ';
				} else {
					ending = hyphen + jot + 'æй';
				}
				break;
			case 'superessive':
				ending = hyphen + jot + 'ыл';
				break;
			case 'equative':
				ending = hyphen + jot + 'ау';
				break;
			case 'comitative':
				ending = hyphen + 'имæ';
				break;
			}

			return word + ending;
		}
	} );
}( jQuery ) );

/**
 * Russian (Русский) language functions
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.ru = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			if ( form === 'genitive' ) { // родительный падеж
				if ( ( word.substr( word.length - 4 ) === 'вики' ) ||
					( word.substr( word.length - 4 ) === 'Вики' )
				) {
					// ...
				} else if ( word.substr( word.length - 1 ) === 'ь' ) {
					word = word.substr( 0, word.length - 1 ) + 'я';
				} else if ( word.substr( word.length - 2 ) === 'ия' ) {
					word = word.substr( 0, word.length - 2 ) + 'ии';
				} else if ( word.substr( word.length - 2 ) === 'ка' ) {
					word = word.substr( 0, word.length - 2 ) + 'ки';
				} else if ( word.substr( word.length - 2 ) === 'ти' ) {
					word = word.substr( 0, word.length - 2 ) + 'тей';
				} else if ( word.substr( word.length - 2 ) === 'ды' ) {
					word = word.substr( 0, word.length - 2 ) + 'дов';
				} else if ( word.substr( word.length - 3 ) === 'ник' ) {
					word = word.substr( 0, word.length - 3 ) + 'ника';
				}
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Slovenian (Slovenščina) language functions
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.sl = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
				// locative
				case 'mestnik':
					word = 'o ' + word;

					break;
				// instrumental
				case 'orodnik':
					word = 'z ' + word;

					break;
			}

			return word;
		}
	} );
}( jQuery ) );

/**
 * Ukrainian (Українська) language functions
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.uk = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
			case 'genitive': // родовий відмінок
				if ( ( word.substr( word.length - 4 ) === 'вікі' ) ||
					( word.substr( word.length - 4 ) === 'Вікі' )
				) {
					// ...
				} else if ( word.substr( word.length - 1 ) === 'ь' ) {
					word = word.substr( 0, word.length - 1 ) + 'я';
				} else if ( word.substr( word.length - 2 ) === 'ія' ) {
					word = word.substr( 0, word.length - 2 ) + 'ії';
				} else if ( word.substr( word.length - 2 ) === 'ка' ) {
					word = word.substr( 0, word.length - 2 ) + 'ки';
				} else if ( word.substr( word.length - 2 ) === 'ти' ) {
					word = word.substr( 0, word.length - 2 ) + 'тей';
				} else if ( word.substr( word.length - 2 ) === 'ды' ) {
					word = word.substr( 0, word.length - 2 ) + 'дов';
				} else if ( word.substr( word.length - 3 ) === 'ник' ) {
					word = word.substr( 0, word.length - 3 ) + 'ника';
				}

				break;
			case 'accusative': // знахідний відмінок
				if ( ( word.substr( word.length - 4 ) === 'вікі' ) ||
					( word.substr( word.length - 4 ) === 'Вікі' )
				) {
					//	...
				} else if ( word.substr( word.length - 2 ) === 'ія' ) {
					word = word.substr( 0, word.length - 2 ) + 'ію';
				}

				break;
			}

			return word;
		}
	} );

}( jQuery ) );

/**
 * cldrpluralparser.js
 * A parser engine for CLDR plural rules.
 *
 * Copyright 2012 GPLV3+, Santhosh Thottingal
 *
 * @version 0.1.0-alpha
 * @source https://github.com/santhoshtr/CLDRPluralRuleParser
 * @author Santhosh Thottingal <santhosh.thottingal@gmail.com>
 * @author Timo Tijhof
 * @author Amir Aharoni
 */

/**
 * Evaluates a plural rule in CLDR syntax for a number
 * @param rule
 * @param number
 * @return true|false|null
 */
function pluralRuleParser(rule, number) {
	/*
	Syntax: see http://unicode.org/reports/tr35/#Language_Plural_Rules
	-----------------------------------------------------------------

	condition     = and_condition ('or' and_condition)*
	and_condition = relation ('and' relation)*
	relation      = is_relation | in_relation | within_relation | 'n' <EOL>
	is_relation   = expr 'is' ('not')? value
	in_relation   = expr ('not')? 'in' range_list
	within_relation = expr ('not')? 'within' range_list
	expr          = 'n' ('mod' value)?
	range_list    = (range | value) (',' range_list)*
	value         = digit+
	digit         = 0|1|2|3|4|5|6|7|8|9
	range         = value'..'value

	*/
	// Indicates current position in the rule as we parse through it.
	// Shared among all parsing functions below.
	var pos = 0;

	var whitespace = makeRegexParser(/^\s+/);
	var digits = makeRegexParser(/^\d+/);

	var _n_ = makeStringParser('n');
	var _is_ = makeStringParser('is');
	var _mod_ = makeStringParser('mod');
	var _not_ = makeStringParser('not');
	var _in_ = makeStringParser('in');
	var _within_ = makeStringParser('within');
	var _range_ = makeStringParser('..');
	var _comma_ = makeStringParser(',');
	var _or_ = makeStringParser('or');
	var _and_ = makeStringParser('and');

	function debug() {
		/* console.log.apply(console, arguments);*/
	}

	debug('pluralRuleParser', rule, number);

	// Try parsers until one works, if none work return null
	function choice(parserSyntax) {
		return function () {
			for (var i = 0; i < parserSyntax.length; i++) {
				var result = parserSyntax[i]();
				if (result !== null) {
					return result;
				}
			}
			return null;
		};
	}

	// Try several parserSyntax-es in a row.
	// All must succeed; otherwise, return null.
	// This is the only eager one.
	function sequence(parserSyntax) {
		var originalPos = pos;
		var result = [];
		for (var i = 0; i < parserSyntax.length; i++) {
			var res = parserSyntax[i]();
			if (res === null) {
				pos = originalPos;
				return null;
			}
			result.push(res);
		}
		return result;
	}

	// Run the same parser over and over until it fails.
	// Must succeed a minimum of n times; otherwise, return null.
	function nOrMore(n, p) {
		return function () {
			var originalPos = pos;
			var result = [];
			var parsed = p();
			while (parsed !== null) {
				result.push(parsed);
				parsed = p();
			}
			if (result.length < n) {
				pos = originalPos;
				return null;
			}
			return result;
		};
	}

	// Helpers -- just make parserSyntax out of simpler JS builtin types

	function makeStringParser(s) {
		var len = s.length;
		return function () {
			var result = null;
			if (rule.substr(pos, len) === s) {
				result = s;
				pos += len;
			}
			return result;
		};
	}

	function makeRegexParser(regex) {
		return function () {
			var matches = rule.substr(pos).match(regex);
			if (matches === null) {
				return null;
			}
			pos += matches[0].length;
			return matches[0];
		};
	}

	function n() {
		var result = _n_();
		if (result === null) {
			debug(" -- failed n");
			return result;
		}
		result = parseFloat(number);
		debug(" -- passed n ", result);
		return result;
	}

	var expression = choice([mod, n]);

	function mod() {
		var result = sequence([n, whitespace, _mod_, whitespace, digits]);
		if (result === null) {
			debug(" -- failed mod");
			return null;
		}
		debug(" -- passed mod");
		return parseInt(result[0], 10) % parseInt(result[4], 10);
	}

	function not() {
		var result = sequence([whitespace, _not_]);
		if (result === null) {
			debug(" -- failed not");
			return null;
		} else {
			return result[1];
		}
	}

	function is() {
		var result = sequence([expression, whitespace, _is_, nOrMore(0, not), whitespace, digits]);
		if (result !== null) {
			debug(" -- passed is");
			if (result[3][0] === 'not') {
				return result[0] !== parseInt(result[5], 10);
			} else {
				return result[0] === parseInt(result[5], 10);
			}
		}
		debug(" -- failed is");
		return null;
	}

	function rangeList() {
		// range_list    = (range | value) (',' range_list)*
		var result = sequence([choice([range, digits]), nOrMore(0, rangeTail)]);
		var resultList = [];
		if (result !== null) {
			resultList = resultList.concat(result[0]);
			if ( result[1][0] ) {
				resultList = resultList.concat(result[1][0]);
			}
			return resultList;
		}
		debug(" -- failed rangeList");
		return null;
	}

	function rangeTail() {
		// ',' range_list
		var result = sequence([_comma_, rangeList]);
		if (result !== null) {
			return result[1];
		}
		debug(" -- failed rangeTail");
		return null;
	}

	function range() {
		var i;
		var result = sequence([digits, _range_, digits]);
		if (result !== null) {
			debug(" -- passed range");
			var array = [];
			var left = parseInt(result[0], 10);
			var right = parseInt(result[2], 10);
			for ( i = left; i <= right; i++) {
				array.push(i);
			}
			return array;
		}
		debug(" -- failed range");
		return null;
	}

	function _in() {
		// in_relation   = expr ('not')? 'in' range_list
		var result = sequence([expression, nOrMore(0, not), whitespace, _in_, whitespace, rangeList]);
		if (result !== null) {
			debug(" -- passed _in");
			var range_list = result[5];
			for (var i = 0; i < range_list.length; i++) {
				if (parseInt(range_list[i], 10) === result[0]) {
					return (result[1][0] !== 'not');
				}
			}
			return (result[1][0] === 'not');
		}
		debug(" -- failed _in ");
		return null;
	}

	function within() {
		// within_relation = expr ('not')? 'within' range_list
		var result = sequence([expression, nOrMore(0, not), whitespace, _within_, whitespace, rangeList]);
		if (result !== null) {
			debug(" -- passed within");
			var range_list = result[5];
			if ( ( result[0] >= parseInt(range_list[0]) ) &&
				( result[0] < parseInt(range_list[range_list.length-1]) ) ) {
				return (result[1][0] !== 'not');
			}
			return (result[1][0] === 'not');
		}
		debug(" -- failed within ");
		return null;
	}


	var relation = choice([is, _in, within]);

	function and() {
		var result = sequence([relation, whitespace, _and_, whitespace, condition]);
		if (result) {
			debug(" -- passed and");
			return result[0] && result[4];
		}
		debug(" -- failed and");
		return null;
	}

	function or() {
		var result = sequence([relation, whitespace, _or_, whitespace, condition]);
		if (result) {
			debug(" -- passed or");
			return result[0] || result[4];
		}
		debug(" -- failed or");
		return null;
	}

	var condition = choice([and, or, relation]);


	function start() {
		var result = condition();
		return result;
	}


	var result = start();

	/*
	 * For success, the pos must have gotten to the end of the rule
	 * and returned a non-null.
	 * n.b. This is part of language infrastructure, so we do not throw an internationalizable message.
	 */
	if (result === null || pos !== rule.length) {
		// throw new Error("Parse error at position " + pos.toString() + " in input: " + rule + " result is " + result);
	}

	return result;
}

/* For module loaders, e.g. NodeJS, NPM */
if (typeof module !== 'undefined' && module.exports) {
	module.exports = pluralRuleParser;
}

