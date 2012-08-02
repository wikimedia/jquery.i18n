/**
 * Hindi (हिन्दी) language functions
 */

(function($) {
	var hindi = $.extend({},  $.i18n.language['default'],{
		'convertPlural' : function(count, forms) {
			forms = this.preConvertPlural(forms, 2);
			return (count <= 1 ) ? forms[0] : forms[1];
		}
	} );
	$.extend($.i18n.language,  {
		'hi' : hindi
	});
} )(jQuery);