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
		slice = Array.prototype.slice,
		hasOwn = Object.prototype.hasOwnProperty;

	/**
	 * @param {string} url Path to location of i18n data in JSON format.
	 * @return {jQuery.Promise} jqXHR promise.
	 */
	function jsonMessageLoader( url ) {
		return $.ajax( {
			url: url,
			dataType: 'json',
			// NOTE: Why disable async? This is deprecated
			// and very bad practice.
			async: false
		} ).fail( function ( jqxhr, status, error ) {
			throw new Error( 'Error in loading messages from ' + url +
				' Exception: ' + error );
		} );
	}

	/**
	 * @constructor
	 * @param {Object} options
	 */
	function I18N( options ) {
		// Load defaults
		this.options = $.extend( {}, I18N.defaults, options );

		this.parser = this.options.parser;
		this.locale = this.options.locale;

		this.messages = {};
		this.sources = {};
		this.languages = {};

		this.init();
	}

	I18N.prototype = {
		constructor: I18N,

		/**
		 * Initialize by loading locales and setting up
		 * String.prototype.toLocaleString and String.locale.
		 */
		init: function () {
			var i18n, $link, $links, linksCount, rel, localization;

			i18n = this;
			$links = $( 'link' );
			linksCount = $links.length;
			this.log( 'Initializing for ' + i18n.locale );

			// Check for <link rel=localization hreflang=xyz> elements
			while (linksCount--) {
				$link = $( $links[linksCount] );
				rel = ( $link.attr( 'rel' ) || '' ).toLowerCase().split( /\s+/ );
				if ( $.inArray( 'localizations', rel ) !== -1 ) {
					// Multiple localizations
					i18n.load( $link.attr( 'href' ) );
				} else if ( $.inArray( 'localization', rel ) !== -1 ) {
					// Single localization
					localization = {};
					localization[ ( $link.attr( 'hreflang' ) || '' ).toLowerCase() ] = $link.attr( 'href' );
					i18n.load( localization );
				}
			}

			// Set locale of String environment
			String.locale = i18n.locale;

			String.prototype.toLocaleString = function () {
				var parts, i, value, locale;

				parts = i18n.locale.toLowerCase().split( '-' );
				i = parts.length;
				value = this.valueOf();
				// Iterate through locales starting at most-specific until
				// localization is found. As in fi-Latn-FI, fi-Latn and fi.
				do {
					locale = parts.slice( 0, i ).join( '-' );
					// load locale if not loaded
					if ( i18n.sources[locale] ) {
						i18n.loadFromQueue( locale );
					}
					if ( i18n.messages[locale] && i18n.messages[locale][value] ) {
						return i18n.messages[locale][value];
					}
				} while (i--);

				// Fallback the original string value.
				return value;
			};
		},

		/**
		 *
		 */
		destroy: function () {
			$.removeData( document, 'i18n' );
		},

		/**
		 * General message loading API This can take a URL string for the json
		 * formatted messages. Eg: load('path/to/all_localizations.json');
		 *
		 * This can also load a localization file for a locale Eg:
		 * load('path/to/de-messages.json', 'de' );
		 *
		 * A data object containing message key- message translation mappings
		 * can also be passed Eg: load( { 'hello' : 'Hello' }, optionalLocale );
		 * If the data argument is omitted, all cached messages for the i18n instance
		 * will be removed.
		 *
		 * @param {string|Object} [optional] data
		 * @param {string} locale Language tag.
		 */
		load: function ( data, locale ) {
			var key,
				i18n = this;

			if ( !data ) {
				// Reset all localizations
				this.log( 'Resetting all localizations' );
				i18n.messages = {};
				return;
			}

			// Only process this data load if the locale is our current
			// locale. Otherwise, put in the source queue for later.
			// NOTE: This doesn't quite work. On a browser with
			// navigator.language = 'en-US' and the following HTML:
			// <link rel="localization" hreflang="en" href="i18n/test-en.json" type="application/l10n+json">
			// <link rel="localization" hreflang="ml" href="i18n/test-ml.json" type="application/l10n+json">
			// Nothing happens when calling $.i18n( { locale: 'en' } )
			// Both are queued, because locale defaults to 'en-US'.
			// > $.i18n().locale
			// > Loading locale: ml, Queueing: ml, Loading locale: en, Queueing: en
			// Even the basic unit tests fail currently because of this.
			if ( locale && this.locale !== locale ) {
				if ( !( locale in this.sources ) ) {
					this.sources[locale] = [];
				}
				this.sources[locale].push( data );
				return;
			}

			if ( typeof data === 'string' ) {
				// This is a URL to the messages file.
				this.log( 'Loading messages from: ' + data );
				jsonMessageLoader( data ).done( function ( loadedData ) {
					delete i18n.sources[locale];
					i18n.load( loadedData, locale );
				} );
			} else {
				// Data is either a group of messages for {locale},
				// or a group of languages with groups of messages inside.
				for ( key in data) {
					if ( hasOwn.call( data, key ) ) {

						if ( locale ) {
							// Lazy-init the object
							if ( !i18n.messages[locale] ) {
								i18n.messages[locale] = {};
							}
							// Update message object keys,
							// don't overwrite the entire object.
							i18n.messages[locale][key] = data[key];

						// No {locale} given, assume data is a group of languages,
						// call this function again for each langauge.
						} else {
							i18n.load( data[key], key );
						}
					}

				}
			}
		},

		log: function () {
			if ( window.console ) {
				window.console.log.apply( window.console, arguments );
			}
		},

		/**
		 * Load the messages from the source queue for the locale
		 *
		 * @param {string} locale
		 */
		loadFromQueue: function ( locale ) {
			var i,
				queue = this.sources[locale];
			for ( i = 0; i < queue.length; i++ ) {
				this.load( queue[i], locale );
			}
			delete this.sources[locale];
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
			// NOTE: This changes the state of the I18N object,
			// should probably not change the 'this.parser' but just
			// pass it to the parser.
			this.parser.language = $.i18n.languages[this.locale] || $.i18n.languages['default'];
			return this.parser.parse( message, parameters );
		}
	};

	/**
	 * Process a message from the $.I18N instance
	 * for the current document, stored in jQuery.data(document).
	 *
	 * @param {string} key Key of the message.
	 * @param {string} [param...] Variadic list of parameters for {key}.
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

		// Lazy-construct I18N instance
		if ( !i18n ) {
			i18n = new I18N( options );
			$.data( document, 'i18n', i18n );

			// During initial setup, process all elements that need
			// translation.
			// NOTE: That means a call like $.i18n('some-key', 'value')
			// returns the processed message and apparently also suddenly
			// goes and does all this in the document. This should not be like that.
			// Instead have something like $('#mystuff').localize() that will go through
			// that and proccess the attributes when needed. This should not be implied
			// at a semi-random point in time. Fragile, unreliable, unmaintainable, unpredictable.
			$( '[data-i18n]' ).each( function () {
				var $this = $( this );
				if ( $this.data( 'i18n' ) ) {
					$this.text( $.i18n( $this.data( 'i18n' ) ) );
				}
			} );
		}

		if ( typeof key === 'string' ) {
			if ( param1 !== undefined ) {
				parameters = slice.call( arguments, 1 );
			} else {
				parameters = [];
			}
			return i18n.parse( key, parameters );
		} else {
			// NOTE: Get rid of this feature. To get the active instance
			// people can use $(document).data('i18n'). Or, if you like,
			// add a method like $.i18n.get() to abstract it (e.g. to avoid
			// third parties from hard-coding the location where the object
			// is stored).
			return i18n;
		}
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


	/* Static members */

	I18N.defaults = {
		locale: String.locale,
		fallbackLocale: 'en',
		parser: $.i18n.parser
	};

	// Expose constructor
	$.I18N = I18N;

	// Convenient alias (TODO: Deprecate this)
	window._ = window._ || $.i18n;

}( jQuery ) );
