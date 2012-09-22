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

( function ( $, window, undefined ) {
	"use strict";

	var I18N = function ( options ) {
		// Load defaults
		this.options = $.extend( {}, $.i18n.defaults, options );
		this.parser = this.options.parser;
		this.messageStore = this.options.messageStore;
		this.languages = {};
		this.locale = this.options.locale;
		this.init();
	};

	I18N.prototype = {
		/**
		 * Initialize by loading locales and setting up toLocaleString
		 */
		init: function () {
			var that = this;
			this.messageStore.init( this.locale );
			// Override String.localeString method
			String.prototype.toLocaleString = function () {
				var value = this.valueOf();
				var locale = that.locale;
				var fallbackIndex = 0;
				while ( locale ) {
					// Iterate through locales starting at most-specific until
					// localization is found. As in fi-Latn-FI, fi-Latn and fi.
					var localeParts = locale.toLowerCase().split( "-" );
					var localePartIndex = localeParts.length;
					do {
						var _locale = localeParts.slice( 0, localePartIndex ).join( "-" );
						if ( !that.messageStore.messages[_locale] ) {
							// FIXME If messageloading gives 404, it keep on trying to
							// load the file again and again
							that.messageStore.load(
									that.options.messageLocationResolver( _locale ), _locale );
						}
						var message = that.messageStore.get( _locale, value );
						if ( message ) {
							return message;
						}
						localePartIndex--;
					} while (localePartIndex);
					if ( locale === "en" ) {
						break;
					}
					locale = ( $.i18n.fallbacks[that.locale] && $.i18n.fallbacks[that.locale][fallbackIndex] )
							|| that.options.fallbackLocale;
					that.log( "Trying fallback locale for " + that.locale + ": " + locale );
					fallbackIndex++;
				}
				return value; // fallback the original string value
			};
			String.locale = this.locale;
		},

		destroy: function () {
			$( 'body' ).data( 'i18n', null );
		},

		/**
		 * General message loading API This can take a URL string for the json formatted messages.
		 * Eg: load('path/to/all_localizations.json');
		 *
		 * This can also load a localization file for a locale Eg: load('path/to/de-messages.json',
		 * 'de' );
		 *
		 * A data object containing message key- message translation mappings can also be passed Eg:
		 * load( { 'hello' : 'Hello' }, optionalLocale ); If the data argument is
		 * null/undefined/false, all cached messages for the i18n instance will get reset.
		 *
		 * @param {String|Object|null} data
		 * @param {String} locale Language tag
		 */
		load: function ( data, locale ) {
			this.messageStore.load( data, locale );
		},

		log: function (/* arguments */) {
			var hasConsole = window.console !== undefined;
			if ( hasConsole && $.i18n.debug ) {
				window.console.log.apply( window.console, arguments );
			}
		},

		/**
		 * Does parameter and magic word substitution.
		 *
		 * @param {String}
		 *            key Message key
		 * @param {Array}
		 *            parameters Message parameters
		 * @return
		 * @string
		 */
		parse: function ( key, parameters ) {
			var message = key.toLocaleString();
			this.parser.language = $.i18n.languages[$.i18n().locale] || $.i18n.languages['default'];
			return this.parser.parse( message, parameters );
		}
	};


	String.locale = String.locale || $( 'html' ).attr( 'lang' );
	if ( !String.locale ) {
		if ( typeof window.navigator !== undefined ) {
			var nav = window.navigator;
			String.locale = nav.language || nav.userLanguage || "";
		} else {
			String.locale = "";
		}
	}

	$.i18n = function ( key, parameter_1 /* [, parameter_2] */) {
		var parameters = [], i18n = $( 'body' ).data( 'i18n' );
		var options = typeof key === 'object' && key;

		if ( options && options.locale && i18n && i18n.locale !== options.locale ) {
			String.locale = i18n.locale = options.locale;
		}

		if ( !i18n ) {
			$( 'body' ).data( 'i18n', ( i18n = new I18N( options ) ) );
			$( '[data-i18n]' ).each( function ( e ) {
				var $this = $( this );
				if ( $this.data( 'i18n' ) ) {
					var messageKey = $this.data( 'i18n' );
					var message = $.i18n( messageKey );
					if ( message !== messageKey ) {
						$this.text( message );
					}
				}
			} );
		}

		if ( !key ) {
			return i18n;
		}

		// Support variadic arguments
		if ( parameter_1 !== undefined ) {
			parameters = $.makeArray( arguments );
			parameters.shift();
		}

		if ( typeof key === 'string' ) {
			return i18n.parse( key, parameters );
		} else {
			return i18n;
		}
	};


	$.fn.i18n = function ( option ) {
		return this.each( function () {
			var $this = $( this );
			if ( $this.data( 'i18n' ) ) {
				var messageKey = $this.data( 'i18n' );
				var message = $.i18n( messageKey );
				if ( message !== messageKey ) {
					$this.text( message );
				}
			} else {
				$this.find( '[data-i18n]' ).i18n();
			}
		} );
	};

	// The default parser only handles variable substitution
	var defaultParser = {
		parse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;
				return parameters[index] !== undefined ? parameters[index] : '$' + match;
			} );
		}
	};

	$.i18n.languages = {};
	$.i18n.messageStore = $.i18n.messageStore || {};
	$.i18n.parser = defaultParser;
	$.i18n.parser.emitter = {};
	$.i18n.debug = false;
	$.i18n.defaults = {
		locale: String.locale,
		fallbackLocale: "en",
		parser: $.i18n.parser,
		messageStore: $.i18n.messageStore,
		messageLocationResolver: function( locale ) {
			return 'i18n/' + locale + ".json";
		}
	};

	$.i18n.Constructor = I18N;

	/**
	 * Convenient alias
	 */
	window._ = window._ || $.i18n;

}( jQuery, window ) );
