( function ( $ ) {
	"use strict";

	$( document ).ready(
			function () {
				var i18n = $.i18n();
				var message = "$1 has $2 {{plural:$2|kitten|kittens}}. "
						+ "{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.";
				var updateText = function () {
					var language = $( '.language option:selected' ).val();
					i18n.locale = language;
					var person = $.i18n( $( '.person option:selected' ).text() );
					var sex = $( '.person option:selected' ).val();
					var kittens = $( '.kittens' ).val();
					$( '.result' )
						.text( $.i18n( message, person, kittens, sex ) )
						.prop( 'title', message.toLocaleString() );
				};
				updateText();
				$( '.kittens, .person, .language' ).on( 'change', updateText );
			} );
}( jQuery ) );
