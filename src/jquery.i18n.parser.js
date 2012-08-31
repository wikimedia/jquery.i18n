;(function($) {
	"use strict";

	var MessageParserEmitter = function(language) {
		this.language = language;
		var that = this;
		/**
		 * (We put this method definition here, and not in prototype, to make sure it's not overwritten by any magic.)
		 * Walk entire node structure, applying replacements and template functions when appropriate
		 * @param {Mixed} abstract syntax tree (top node or subnode)
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {Mixed} single-string node or array of nodes suitable for jQuery appending
		 */
		this.emit = function(node, replacements) {
			var ret = null;
			var that = this;

			switch (typeof node) {
				case 'string':
				case 'number':
					ret = node;
					break;
				case 'object':
					// node is an array of nodes
					var subnodes = $.map(node.slice(1), function(n) {
						return that.emit(n, replacements);
					});
					var operation = node[0].toLowerCase();
					if ( typeof that[operation] === 'function') {
						ret = that[operation](subnodes, replacements);
					} else {
						throw new Error('unknown operation "' + operation + '"');
					}
					break;
				case 'undefined':
					// Parsing the empty string (as an entire expression, or as a paramExpression in a template) results in undefined
					// Perhaps a more clever parser can detect this, and return the empty string? Or is that useful information?
					// The logical thing is probably to return the empty string here when we encounter undefined.
					ret = '';
					break;
				default:
					throw new Error('unexpected type in AST: ' + typeof node);
			}
			return ret;
		};

		/**
		 * Parsing has been applied depth-first we can assume that all nodes here are single nodes
		 * Must return a single node to parents -- a jQuery with synthetic span
		 * However, unwrap any other synthetic spans in our children and pass them upwards
		 * @param {Array} nodes - mixed, some single nodes, some arrays of nodes
		 * @return {jQuery}
		 */
		this.concat = function(nodes) {
			var result = "";
			$.each(nodes, function(i, node) {
				// strings, integers, anything else
				result += node;
			});
			return result;
		};

		/**
		 * Return escaped replacement of correct index, or string if unavailable.
		 * Note that we expect the parsed parameter to be zero-based. i.e. $1 should have become [ 0 ].
		 * if the specified parameter is not found return the same string
		 * (e.g. "$99" -> parameter 98 -> not found -> return "$99" )
		 * TODO throw error if nodes.length > 1 ?
		 * @param {Array} of one element, integer, n >= 0
		 * @return {String} replacement
		 */
		this.replace  = function(nodes, replacements) {
			var index = parseInt(nodes[0], 10);

			if (index < replacements.length) {
				// replacement is not a string, don't touch!
				return replacements[index];
			} else {
				// index not found, fallback to displaying variable
				return '$' + (index + 1);
			}
		};

		/**
		 * Transform parsed structure into pluralization
		 * n.b. The first node may be a non-integer (for instance, a string representing an Arabic number).
		 * So convert it back with the current language's convertNumber.
		 * @param {Array} of nodes, [ {String|Number}, {String}, {String} ... ]
		 * @return {String} selected pluralized form according to current language
		 */
		this.plural = function(nodes) {
			var count = parseInt(this.language.convertNumber(nodes[0], true), 10);
			var forms = nodes.slice(1);
			return forms.length ? this.language.convertPlural(count, forms) : '';
		};

		/**
		 * Transform parsed structure into gender
		 * Usage {{gender:[gender| mw.user object ] | masculine|feminine|neutral}}.
		 * @param {Array} of nodes, [ {String|mw.User}, {String}, {String} , {String} ]
		 * @return {String} selected gender form according to current language
		 */
		this.gender = function(nodes) {
			var gender = nodes[0];
			var forms = nodes.slice(1);
			return this.language.gender(gender, forms);
		};

		/**
		 * Transform parsed structure into grammar conversion.
		 * Invoked by putting {{grammar:form|word}} in a message
		 * @param {Array} of nodes [{Grammar case eg: genitive}, {String word}]
		 * @return {String} selected grammatical form according to current language
		 */
		this.grammar = function(nodes) {
			var form = nodes[0];
			var word = nodes[1];
			return word && form && this.language.convertGrammar(word, form);
		};
	};

	var MessageParser = function(options) {
		this.options = $.extend({}, $.i18n.parser.defaults, options);
		this.language = $.i18n.languages[$.i18n().locale];
		this.emitter = $.i18n.parser.emitter;
	};

	$.i18n.parser.prototype = $.extend({}, $.i18n.parser.prototype, {
		constructor : MessageParser,

		emitter : function() {
			var language = $.i18n.language[String.locale] ||  $.i18n.language['default'] ;
			return new MessageParserEmitter(language);
		},

		simpleParse : function(message, parameters) {
			return message.replace(/\$(\d+)/g, function(str, match) {
				var index = parseInt(match, 10) - 1;
				return parameters[index] !== undefined ? parameters[index] : '$' + match;
			});
		},

		parse : function(message, replacements) {
			if (message.indexOf('{{') < 0) {
				return this.simpleParse(message, replacements);
			}
			this.emitter.language =  $.i18n.languages[$.i18n().locale]|| $.i18n.languages['default']; //this.language;
			return this.emitter.emit(this.ast(message), replacements);
		},

		ast : function(message) {
			var pos = 0;
			var whitespace = makeRegexParser(/^\s+/);
			var digits = makeRegexParser(/^\d+/);
			var regularLiteral = makeRegexParser(/^[^{}[\]$\\]/);
			var regularLiteralWithoutBar = makeRegexParser(/^[^{}[\]$\\|]/);
			var regularLiteralWithoutSpace = makeRegexParser(/^[^{}[\]$\s]/);
			var backslash = makeStringParser("\\");
			var anyCharacter = makeRegexParser(/^./);
			var dollar = makeStringParser('$');

			// Try parsers until one works, if none work return null
			function choice(parserSyntax) {
				return function() {
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
				return function() {
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
				return function() {
					var result = null;
					if (message.substr(pos, len) === s) {
						result = s;
						pos += len;
					}
					return result;
				};
			}

			function makeRegexParser(regex) {
				return function() {
					var matches = message.substr(pos).match(regex);
					if (matches === null) {
						return null;
					}
					pos += matches[0].length;
					return matches[0];
				};
			}

			// There is a general pattern -- parse a thing, if that worked, apply transform, otherwise return null.
			// But using this as a combinator seems to cause problems when combined with nOrMore().
			// May be some scoping issue
			function transform(p, fn) {
				return function() {
					var result = p();
					return result === null ? null : fn(result);
				};
			}

			// Used to define "literals" without spaces, in space-delimited situations
			function literalWithoutSpace() {
				var result = nOrMore( 1, escapedOrLiteralWithoutSpace )();
				return result === null ? null : result.join('');
			}

			// Used to define "literals" within template parameters. The pipe character is the parameter delimeter, so by default
			// it is not a literal in the parameter
			function literalWithoutBar() {
				var result = nOrMore( 1, escapedOrLiteralWithoutBar )();
				return result === null ? null : result.join('');
			}

			function literal() {
				var result = nOrMore( 1, escapedOrRegularLiteral )();
				return result === null ? null : result.join('');
			}

			function escapedLiteral() {
				var result = sequence([backslash, anyCharacter]);
				return result === null ? null : result[1];
			}

			var escapedOrLiteralWithoutSpace = choice([escapedLiteral, regularLiteralWithoutSpace]);

			var escapedOrLiteralWithoutBar = choice([escapedLiteral, regularLiteralWithoutBar]);

			var escapedOrRegularLiteral = choice([escapedLiteral, regularLiteral]);

			function replacement() {
				var result = sequence([dollar, digits]);
				if (result === null) {
					return null;
				}
				return ['REPLACE', parseInt(result[1], 10) - 1];
			}

			var templateName = transform(
				// see $wgLegalTitleChars
				// not allowing : due to the need to catch "PLURAL:$1"
				makeRegexParser(/^[ !"$&'()*,.\/0-9;=?@A-Z\^_`a-z~\x80-\xFF+-]+/),
				function(result) {
					return result.toString();
				}
			);

			function templateParam() {
				var result = sequence([pipe, nOrMore(0, paramExpression)]);
				if (result === null) {
					return null;
				}
				var expr = result[1];
				// use a "CONCAT" operator if there are multiple nodes, otherwise return the first node, raw.
				return expr.length > 1 ? ["CONCAT"].concat(expr) : expr[0];
			}

			var pipe = makeStringParser('|');

			function templateWithReplacement() {
				var result = sequence([templateName, colon, replacement]);
				return result === null ? null : [result[0], result[2]];
			}

			function templateWithOutReplacement() {
				var result = sequence([templateName, colon, paramExpression]);
				return result === null ? null : [result[0], result[2]];
			}

			var colon = makeStringParser(':');

			var templateContents = choice([
				function() {
					var res = sequence([
						// templates can have placeholders for dynamic replacement eg: {{PLURAL:$1|one car|$1 cars}}
						// or no placeholders eg: {{GRAMMAR:genitive|{{SITENAME}}}
						choice([templateWithReplacement, templateWithOutReplacement]),
						nOrMore(0, templateParam)
					]);

					return res === null ? null : res[0].concat(res[1]);
				},
				function() {
					var res = sequence([
						templateName,
						nOrMore(0, templateParam)
					]);

					if (res === null) {
						return null;
					}

					return [res[0]].concat(res[1]);
				}
			]);

			var openTemplate = makeStringParser('{{');

			var closeTemplate = makeStringParser('}}');

			var paramExpression = choice([template, replacement, literalWithoutBar]);

			var expression = choice([template, replacement, literal]);

			function template() {
				var result = sequence([openTemplate, templateContents, closeTemplate]);
				return result === null ? null : result[1];
			}

			function start() {
				var result = nOrMore( 0, expression )();

				if (result === null) {
					return null;
				}

				return ["CONCAT"].concat(result);
			}

			var result = start();
			return result;
		}
	} );

} )(jQuery);
