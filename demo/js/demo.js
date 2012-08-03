(function($) {
	$(document).ready(function() {
		var message = "$1 has $2 {{plural:$2|kitten|kittens}}. {{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.";
		$('.kittens, .person, .language').on('change', function() {
			var language = $('.language option:selected').val();
			$.i18n({
				locale : language
			});
			var person = $('.person option:selected').text();
			var sex = $('.person option:selected').val();
			var kittens = $('.kittens').val();
			$('.result').text($.i18n(message, person, kittens, sex));
		});
	});
} )(jQuery);
