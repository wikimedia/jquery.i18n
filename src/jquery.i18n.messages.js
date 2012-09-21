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
	"use strict";

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
			this.locale = locale;
			var that = this;
			var $links = $( "link" );
			var linksCount = $links.length;
			this.log( "initializing for " + locale );
			// Check for <link rel="localization" hreflang="xyz" elements
			while (linksCount--) {
				var $link = $( $links[linksCount] );
				var rel = ( $link.attr( "rel" ) || "" ).toLowerCase().split( /\s+/ );
				if ( $.inArray( "localizations", rel ) !== -1 ) {
					// multiple localizations
					that.load( $link.attr( "href" ) );
				} else if ( $.inArray( "localization", rel ) !== -1 ) {
					// single localization
					var localization = {};
					localization[ ( $link.attr( "hreflang" ) || "" ).toLowerCase()] = $link
							.attr( "href" );
					that.load( localization );
				}
			}
		},

		/**
		 * General message loading API This can take a URL string for the json formatted messages.
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * This can also load a localization file for a locale <code>
		 * load('path/to/de-messages.json', 'de' );
		 * </code>
		 * A data object containing message key- message translation mappings can also be passed Eg:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code> If the data argument is
		 * null/undefined/false, all cached messages for the i18n instance will get reset.
		 *
		 * @param {String|Object|null} data
		 * @param {String} locale Language tag
		 */
		load: function ( data, locale ) {
			var that = this;
			var hasOwn = Object.prototype.hasOwnProperty;
			if ( !data ) {
				// reset all localizations
				this.log( "Resetting for locale" + locale );
				that.messages = {};
				return;
			}
			var dataType = typeof data;
			if ( locale && this.locale !== locale ) {
				// queue loading locale if not needed
				if ( ! ( locale in this.sources ) ) {
					this.sources[locale] = [];
				}
				this.log( "Queueing: " + locale + " Current locale " + this.locale );
				this.sources[locale].push( data );
				return;
			}
			if ( arguments.length > 0 && dataType !== "number" ) {
				if ( dataType === "string" ) {
					// This is a URL to the messages file.
					this.log( "Loading messages from: " + data );
					this.jsonMessageLoader( data ).done( function ( localization, textStatus ) {
						that.load( localization, locale );
						delete that.sources[locale];
					} );
				} else {
					// data is Object
					// Extend current localizations instead of completely
					// overwriting them
					var localization = data;
					for ( var messageKey in localization ) {
						if ( !hasOwn.call( localization, messageKey ) ) {
							continue;
						}
						var messageKeyType = typeof messageKey;
						if ( messageKeyType === "string" && locale ) {
							that.log( "[" + locale + "][" + messageKey + "] : "
									+ localization[messageKey] );
							that.messages[locale] = that.messages[locale] || [];
							that.messages[locale][messageKey] = localization[messageKey];
						} else {
							var passedLocale = messageKey;
							this.log( "Loading locale: " + passedLocale );
							that.load( localization[passedLocale], passedLocale );
						}
					}
				}
			}
		},

		log: function (/* arguments */) {
			var hasConsole = window.console !== undefined;
			if ( hasConsole && $.i18n.debug ) {
				window.console.log.apply( window.console, arguments );
			}
		},

		/**
		 * Load the messages from the source queue for the locale
		 *
		 * @param {String} locale
		 */
		loadFromQueue: function ( locale ) {
			var that = this;
			var queue = that.sources[locale];
			for ( var i = 0; i < queue.length; i++ ) {
				that.load( queue[i], locale );
			}
			delete that.sources[locale];
		},

		jsonMessageLoader: function ( url ) {
			var that = this;
			return $.ajax( {
				url: url,
				dataType: "json",
				async: false
			// that is unfortunate
			} ).fail( function ( jqxhr, settings, exception ) {
				that.log( "Error in loading messages from " + url + " Exception: " + exception );
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
			if ( this.sources[locale] ) {
				// We need to switch to this locale
				this.locale = locale;
				this.loadFromQueue( locale );
			}
			return this.messages[locale] && this.messages[locale][messageKey];
		}
	};

	$.extend( $.i18n.messageStore, new MessageStore() );

}( jQuery, window ) );
