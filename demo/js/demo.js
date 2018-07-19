function updateText() {
	'use strict';
	var i18n = $.i18n(), language, person, kittens, message, gender;

	message = '$1 has $2 {{plural:$2|kitten|kittens}}. ' +
		'{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
	language = $( '.language option:selected' ).val();
	person = $( '.person option:selected' ).text();
	gender = $( '.person option:selected' ).val();
	kittens = $( '.kittens' ).val();

	i18n.locale = language;
	i18n.load( 'i18n/demo-' + i18n.locale + '.json', i18n.locale ).done(
		function () {
			var personName = $.i18n( person ), localizedMessage = $.i18n( message, personName,
				kittens, gender );
			$( '.result' ).text( localizedMessage ).prop( 'title', i18n.localize( message ) );
		} );
}
// Enable debug
$.i18n.debug = true;

$( document ).ready( function ( $ ) {
	'use strict';
	updateText();
	$( '.kittens, .person, .language' ).on( 'change keyup', updateText );
} );
