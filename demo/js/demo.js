jQuery( document ).ready( function ( $ ) {
	'use strict';

	var message = '$1 has $2 {{plural:$2|kitten|kittens}}. ' +
		'{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
	function updateText() {
		var language, person, sex, kittens;

		language = $( '.language option:selected' ).val();
		person = $.i18n( $( '.person option:selected' ).text() );
		sex = $( '.person option:selected' ).val();
		kittens = $( '.kittens' ).val();

		$.i18n( {
			locale: language
		} );

		$( '.result' ).text( $.i18n( message, person, kittens, sex ) );
	}

	updateText();

	$( '.kittens, .person, .language' ).on( 'change', updateText );
} );
