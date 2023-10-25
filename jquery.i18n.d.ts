/*!
 * jQuery Internationalization library - Message Store
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

interface JQuery {
    /**
     * Translate the jquery element based on the data-i18n key
     */
    i18n: () => void;
}

interface JQueryStatic {
    i18n: I18NStatic;
}

interface I18NConstructor {
    defaults: I18NOptions;

    new( options: I18NOptions ): I18N;
}

interface I18NStatic {
    locale: string;
    fallbacks: { [locale: string]: string[] };
    languages: { [locale: string]: Language };
    messageStore: MessageStore;
    parser: MessageParser;
    constructor: I18NConstructor;
    debug: boolean;

    /**
     * Return the current instance of $.I18N
     */
    (): I18N;

    /**
     * Process a message from the $.I18N instance
     * for the current document, stored in jQuery.data(document).
     *
     * @param {string} key Key of the message.
     * @param {string[]} parameters Variadic list of parameters for {key}.
     * @return {string} Parsed message
     */
    ( key: string, ...parameters: string[] ): string

    log( ...args: any[] ): void;
}

interface I18N {
    options: I18NOptions;
    parser: MessageParser;
    locale: string;
    messageStore: MessageStore;
    languages: { [locale: string]: Language };

    /**
     * Localize a given messageKey to a locale.
     * @param {string} messageKey
     * @returns {string} Localized message
     */
    localize( messageKey: string ): string;

    /**
     * If the data argument is null/undefined/false,
     * all cached messages for the i18n instance will get reset.
     */
    load(): void;

    /**
     * General message loading API
     *
     * This can take a URL string for
     * the json formatted messages. Example:
     * ```js
     * load('path/to/all_localizations.json');
     * ```
     *
     * To load a localization file for a locale:
     * ```js
     * load('path/to/de-messages.json', 'de' );
     * ```
     *
     * To load a localization file from a directory:
     * ```js
     * load('path/to/i18n/directory', 'de' );
     * ```
     * The above method has the advantage of fallback resolution.
     * ie, it will automatically load the fallback locales for de.
     * For most use-cases, this is the recommended method.
     * It is optional to have trailing slash at end.
     * @param source file or directory path
     * @param locale optional language tag
     */
    load( source: string, locale?: string ): JQuery.Promise<any>;

    /**
     * A source map containing key-value pair of language name and locations
     * can also be passed. Example:
     * ```js
     * load( {
     * bn: 'i18n/bn.json',
     * he: 'i18n/he.json',
     * en: 'i18n/en.json'
     * } )
     * ```
     * @param source map of language names and location paths
     */
    load( source: Record<string, string> ): JQuery.Promise<any>;

    /**
     * A data object containing message key-message translation mappings
     * can also be passed. Example:
     * <code>
     * load( { 'hello' : 'Hello' }, optionalLocale );
     * </code>
     * @param data map of message keys and messages
     * @param locale optional language tag
     */
    load( data: Record<string, string>, locale?: string ): JQuery.Promise<any>;

    /**
     * Does parameter and magic word substitution.
     * @param {string} key Message key
     * @param {Array} parameters Message parameters
     */
    parse( key: string, parameters?: string[] ): string;

    /**
     * Destroy the i18n instance.
     */
    destroy(): void;
}

interface I18NOptions {
    locale: string;
    fallbackLocale: string;
    parser: MessageParser;
    messageStore: MessageStore;
}

type ASTNode = string | number | JQuery | ASTNode[];

interface MessageParser {
    constructor: {
        new( options: I18NOptions ): MessageParser;
    };
    emitter: MessageParserEmitter;
    language: Language;

    simpleParse( message: string, parameters?: string[] ): string;

    parse( message: string, replacements?: string[] ): string;

    ast( message: string ): ASTNode[];
}

interface MessageParserEmitter {
    constructor: {
        new(): MessageParserEmitter;
    }

    /**
     * (We put this method definition here, and not in prototype, to make
     * sure it's not overwritten by any magic.) Walk entire node structure,
     * applying replacements and template functions when appropriate
     *
     * @param {ASTNode} node abstract syntax tree (top node or subnode)
     * @param {Array} replacements for $1, $2, ... $n
     * @return {ASTNode} single-string node or array of nodes suitable for
     *  jQuery appending.
     */
    emit( node: ASTNode, replacements: string[] ): ASTNode;

    /**
     * Parsing has been applied depth-first we can assume that all nodes
     * here are single nodes Must return a single node to parents -- a
     * jQuery with synthetic span However, unwrap any other synthetic spans
     * in our children and pass them upwards
     *
     * @param {Array} nodes Mixed, some single nodes, some arrays of nodes.
     * @return {string}
     */
    concat( nodes: ASTNode[] ): string;

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
    replace( nodes: [number], replacements: string[] ): string;

    /**
     * Transform parsed structure into pluralization n.b. The first node may
     * be a non-integer (for instance, a string representing an Arabic
     * number). So convert it back with the current language's
     * convertNumber.
     *
     * @return {string} selected pluralized form according to current
     *  language.
     */
    plural( nodes: [string | number, ...string[]] ): string;

    /**
     * Transform parsed structure into gender Usage
     * {{gender:gender|masculine|feminine|neutral}}.
     *
     * @return {string} selected gender form according to current language
     */
    gender( nodes: [string, string, string, string] ): string

    /**
     * Transform parsed structure into grammar conversion. Invoked by
     * putting {{grammar:form|word}} in a message
     *
     * @param {string} nodes.form grammar case, e.g.: genitive
     * @param {string} nodes.word word to transform
     * @return {string} selected grammatical form according to current
     *  language.
     */
    grammar( nodes: [form: string, word: string] ): string;

    /**
     * Wraps argument with unicode control characters for directionality safety
     *
     * This solves the problem where directionality-neutral characters at the edge of
     * the argument string get interpreted with the wrong directionality from the
     * enclosing context, giving renderings that look corrupted like "(Ben_(WMF".
     *
     * The wrapping is LRE...PDF or RLE...PDF, depending on the detected
     * directionality of the argument string, using the BIDI algorithm's own "First
     * strong directional codepoint" rule. Essentially, this works round the fact that
     * there is no embedding equivalent of U+2068 FSI (isolation with heuristic
     * direction inference). The latter is cleaner but still not widely supported.
     *
     * @param {string[]} nodes The text nodes from which to take the first item.
     * @return {string} Wrapped String of content as needed.
     */
    bidi( nodes: string[] ): string
}

interface Language {
    /**
     * CLDR plural rules generated using
     * libs/CLDRPluralRuleParser/tools/PluralXML2JSON.html
     */
    pluralRules: { [locale: string]: string };

    /**
     * Plural form transformations, needed for some languages.
     *
     * @param {number} count Non-localized quantifier
     * @param {Array} forms List of plural forms
     * @return {string} Correct form for quantifier in this language
     */
    convertPlural( count: number, forms: string[] ): string;

    /**
     * For the number, get the plural for index
     *
     * @return {number} plural form index
     */
    getPluralForm( num: number, pluralRules: { [form: string]: string } ): number;

    /**
     * Converts a number using digitTransformTable.
     *
     * @param {number} num Value to be converted
     * @param {boolean} integer Convert the return value to an integer
     * @return {string} The number converted into a tring.
     */
    convertNumber( num: number, integer?: boolean ): string;

    /**
     * Grammatical transformations, needed for inflected languages.
     * Invoked by putting {{grammar:form|word}} in a message.
     * Override this method for languages that need special grammar rules
     * applied dynamically.
     */
    convertGrammar( word: string, form: string ): string;

    /**
     * Provides an alternative text depending on specified gender. Usage
     * {{gender:[gender|user object]|masculine|feminine|neutral}}. If second
     * or third parameter are not specified, masculine is used.
     *
     * These details may be overriden per language.
     *
     * @param {string} gender male, female, or anything else for neutral.
     * @param {Array} forms List of gender forms
     * @return {string}
     */
    gender( gender: string, forms: string[] ): string;

    /**
     * Get the digit transform table for the given language
     * See http://cldr.unicode.org/translation/numbering-systems
     *
     * @return {Array|boolean} List of digits in the passed language or false
     * representation, or boolean false if there is no information.
     */
    digitTransformTable( language: string ): string[] | false;
}

interface MessageStore {
    messages: { [locale: string]: { [messageKey: string]: string } };
    sources: any;

    /**
     * If the data argument is null/undefined/false,
     * all cached messages for the i18n instance will get reset.
     */
    load(): void;

    /**
     * General message loading API
     *
     * This can take a URL string for
     * the json formatted messages. Example:
     * ```js
     * load('path/to/all_localizations.json');
     * ```
     *
     * To load a localization file for a locale:
     * ```js
     * load('path/to/de-messages.json', 'de' );
     * ```
     *
     * To load a localization file from a directory:
     * ```js
     * load('path/to/i18n/directory', 'de' );
     * ```
     * The above method has the advantage of fallback resolution.
     * ie, it will automatically load the fallback locales for de.
     * For most use-cases, this is the recommended method.
     * It is optional to have trailing slash at end.
     * @param source file or directory path
     * @param locale optional language tag
     */
    load( source: string, locale?: string ): JQuery.Promise<any>;

    /**
     * A source map containing key-value pair of language name and locations
     * can also be passed. Example:
     * ```js
     * load( {
     * bn: 'i18n/bn.json',
     * he: 'i18n/he.json',
     * en: 'i18n/en.json'
     * } )
     * ```
     * @param source map of language names and location paths
     */
    load( source: Record<string, string> ): JQuery.Promise<any>;

    /**
     * A data object containing message key-message translation mappings
     * can also be passed. Example:
     * <code>
     * load( { 'hello' : 'Hello' }, optionalLocale );
     * </code>
     * @param data map of message keys and messages
     * @param locale optional language tag
     */
    load( data: Record<string, string>, locale?: string ): JQuery.Promise<any>;

    /**
     * Set messages to the given locale.
     * If locale exists, add messages to the locale.
     *
     * @param {string} locale
     * @param {Object} messages
     */
    set( locale: string, messages: { [messageKey: string]: string } ): void;

    /**
     * Checks if the given locale exists with a given messageKey
     * @param {string} locale
     * @param {string} messageKey
     * @return {boolean}
     */
    get( locale: string, messageKey: string ): string | boolean;
}
