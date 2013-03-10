/**
 * Malayalam language functions
 *
 * @author Santhosh Thottingal
 */

( function ( $ ) {
	'use strict';

	$.i18n.languages.ml = $.extend( {}, $.i18n.languages['default'], {
		convertGrammar: function ( word, form ) {
			switch ( form ) {
				case 'ഉദ്ദേശിക':
				case 'dative':
					if ( word.substr( -1 ) === 'ു' ) {
						// പശു  -> പശുവിന്
						word += 'വിന്';
					} else if ( word.substr( -1 ) === 'ൻ' ) {
						// Atomic chillu n. അവൻ  -> അവന്
						word = word.substr( 0, word.length - 1 ) + 'ന്';
					} else if ( word.substr( -3 ) === 'ന്‍' ) {
						// chillu n. അവൻ  -> അവന്
						word = word.substr( -1 );
					} else if ( word.substr( -1 ) === 'ൾ' || word.substr( -3 ) === 'ള്‍' ) {
						word += 'ക്ക്';
					} else if ( word.substr( -1 ) === 'ൽ' ) {
						// Atomic chillu ൽ , ഫയൽ  -> ഫയലിന്
						word = word.substr( 0, word.length - 1 ) + 'ലിന്';
					} else if ( word.substr( -3 ) === 'ല്‍' ) {
						// chillu ല്‍ , ഫയല്‍ -> ഫയലിന്
						word = word.substr( 0, word.length - 2 ) + 'ിന്';
					} else if ( word.substr( -1 ) === '്' ) {
						word = word.substr( 0, word.length - 1 ) + 'ിന്';
					} else {
						// കാവ്യ  -> കാവ്യയ്ക്ക്, ഹരി -> ഹരിയ്ക്ക്, മല  -> മലയ്ക്ക്
						word += 'യ്ക്ക്';
					}
					break;
			}
			return word;
		}
	} );
}( jQuery ) );
