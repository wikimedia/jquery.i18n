(function($) {
	var I18N = function(options) {
		this.options = $.extend({}, $.i18n.defaults, options)
		this.messages = {};
		this.sources = {};
		this.init();
	};

	I18N.prototype = {
		/**
		 *
		 */
		init : function() {
			var that = this;
			var $links = $("link");
			var linksLength = $links.length;
			var l10nJsonMediaType = /^\s*application\/l10n\+json\s*(?:$|;)/i;
			while (linksLength--) {
				var $link = $($links[linksLength]);
				var rel = ($link.attr("rel") || "").toLowerCase().split(/\s+/);
				if (l10nJsonMediaType.test($link.attr("type"))) {
					if ($.inArray("localizations", rel) !== -1) {
						// multiple localizations
						that.load($link.attr("href"));
					} else if ($.inArray("localization", rel) !== -1) {
						// single localization
						var localization = {};
						localization[($link.attr("hreflang") || "").toLowerCase()] = $link.attr("href");
						that.load(localization);
					}
				}
			}

			String.prototype.toLocaleString = function() {
				var parts = String.locale.toLowerCase().split("-");
				var i = parts.length;
				var this_val = this.valueOf();
				// Iterate through locales starting at most-specific until localization is found
				do {
					var locale = parts.slice(0, i).join("-");
					// load locale if not loaded
					if ( locale in that.sources) {
						that._process_load_queue(locale);
					}
					if ( locale in that.messages && this_val in that.messages[locale]) {
						return that.messages[locale][this_val];
					}
				} while (i--);
				return this_val;
			};
		},
		/**
		 *
		 */
		load : function(data) {
			var that = this;
			var hasOwn = Object.prototype.hasOwnProperty;
			if (arguments.length > 0 && typeof data !== "number") {
				if ( typeof data === "string") {
					this.log("Data is string");
					that.load(that.scriptLoader(String.locale, data));
				} else if (!data) {
					// reset all localizations
					this.log("Resetting.");
					that.messages = {};
				} else {
					// Extend current localizations instead of completely overwriting them
					for (var locale in data) {
						this.log("Loading: " + locale);
						if (hasOwn.call(data, locale)) {
							var localization = data[locale];
							locale = locale.toLowerCase();
							if (!( locale in that.messages) || !localization) {
								// reset locale if not existing or reset flag is specified
								that.messages[locale] = {};
							}

							if (!localization) {
								continue;
							}

							// URL specified
							if ( typeof localization === "string") {
								if (that.options.locale.toLowerCase().indexOf(locale) === 0) {
									localization = that.scriptLoader(locale, localization);
								} else {
									// queue loading locale if not needed
									if (!( locale in this.sources)) {
										this.sources[locale] = [];
									}
									this.log("Queueing: " + localization);
									this.sources[locale].push(localization);
									continue;
								}
							}

						}
					}
				}
			}
			return Function.prototype.toLocaleString.apply(String, arguments);
		},

		log : function(/* arguments */) {
			console.log.apply(console, arguments);
		},
		scriptLoader : function(locale, name) {
			var that = this;
			var hasOwn = Object.prototype.hasOwnProperty;
			$.ajax({
				url : name,
				dataType : "json",
				success : function(localization, textStatus) {
					if (!locale) {
						that.messages = localization[message];
					} else {
						for (var message in localization) {
							if (hasOwn.call(localization, message)) {
								that.messages[locale][message] = localization[message];
							}
						}
					}
					that.loaded();
				},
				failure : function(jqxhr, settings, exception) {
					console.log(" Triggered ajaxError handler." + exception);
				}
			});
			return true;
		},
		loaded : function() {
			/* i18n DATA-API */
			$('[data-i18n]').each(function(e) {
				var $this = $(this);
				if ($this.data('i18n')) {
					$this.text($this.data('i18n').toLocaleString());
				}
			});
		},
		/**
		 *
		 */
		_process_load_queue : function(locale) {
			var that = this;
			var queue = that.sources[locale], i = 0, len = queue.length;
			for (; i < len; i++) {
				var localization = {};
				localization[locale] = that.scriptLoader(locale, queue[i]);
				that.load(localization);
			}
			delete that.sources[locale];
		},
		parse : function(key, parameters) {
			return key.toLocaleString();
		}
	};

	if (!String.locale) {
		if ( typeof navigator !== undefined) {
			var nav = navigator;
			String.locale = nav.language || nav.userLanguage || "";
		} else {
			String.locale = "";
		}
	}

	$.i18n = function(key, parameter_1 /* [, parameter_2] */ ) {
		var parameters = [];
		var i18n = $('body').data('i18n');
		if (!i18n) {
			var options = typeof key == 'object' && key;
			$('body').data('i18n', ( i18n = new I18N(options)));
			return;
		}
		// Support variadic arguments
		if (parameter_1 !== undefined) {
			parameters = $.makeArray(arguments);
			parameters.shift();

		}
		return i18n.parse(key, parameters);
	};
	$.i18n.defaults = {
		locale : String.locale,
		fallbackLocale : "en"
	}
	/**
	 * Convinient alias
	 */
	$._ = $.i18n;

} )(jQuery);
