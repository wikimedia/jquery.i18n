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
			var messageStore = this;
			messageStore.log( "initializing for " + locale );
			var $links = $( "link" );
			var linksCount = $links.length;
			// Check for <link rel="localization" hreflang="xyz" elements
			while (linksCount--) {
				var $link = $( $links[linksCount] );
				var rel = ( $link.attr( "rel" ) || "" ).toLowerCase().split( /\s+/ );
				if ( $.inArray( "localizations", rel ) !== -1 ) {
					// multiple localizations
					messageStore.load( $link.attr( "href" ) );
				} else if ( $.inArray( "localization", rel ) !== -1 ) {
					// single localization
					var localization = {};
					localization[ ( $link.attr( "hreflang" ) || "" ).toLowerCase()] = $link
							.attr( "href" );
					messageStore.load( localization );
				}
			}
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
				messageStore.log( "Resetting for locale" + locale );
				messageStore.messages = {};
				return;
			}

			// Only process this data load if the locale is our current
			// locale. Otherwise, put in the source queue for later.
			if ( locale && messageStore.locale !== locale ) {
				// queue loading locale if not needed
				if ( ! ( locale in messageStore.sources ) ) {
					messageStore.sources[locale] = [];
				}
				messageStore.log( "Queueing: " + locale + " Current locale " + messageStore.locale );
				messageStore.sources[locale].push( data );
				return;
			}

			if ( typeof data === 'string' ) {
				// This is a URL to the messages file.
				messageStore.log( "Loading messages from: " + data );
				messageStore.jsonMessageLoader( data ).done( function ( localization, textStatus ) {
					messageStore.load( localization, locale );
					delete messageStore.sources[locale];
				} );
			} else {
				// Data is either a group of messages for {locale},
				// or a group of languages with groups of messages inside.
				for ( key in data) {
					if ( hasOwn.call( data, key ) ) {
						if ( locale ) {

							// Lazy-init the object
							if ( !messageStore.messages[locale] ) {
								messageStore.messages[locale] = {};
							}

							// Update message object keys,
							// don't overwrite the entire object.
							messageStore.messages[locale][key] = data[key];

							messageStore.log( "[" + locale + "][" + key + "] : "
									+ data[key] );

							// No {locale} given, assume data is a group of languages,
							// call this function again for each langauge.
						} else {
							messageStore.load( data[key], key );
						}
					}
				}
			}
		},

		log: function (/* arguments */) {
			if ( window.console && $.i18n.debug ) {
				window.console.log.apply( window.console, arguments );
			}
		},

		/**
		 * Load the messages from the source queue for the locale
		 *
		 * @param {String} locale
		 */
		loadFromQueue: function ( locale ) {
			var i,
				queue = this.sources[locale];
			for ( i = 0; i < queue.length; i++ ) {
				this.load( queue[i], locale );
			}
			delete this.sources[locale];
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
