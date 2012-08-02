(function($) {"use strict";
	var language = {
		/**
		 * Pads an array to a specific length by copying the last one element.
		 *
		 * @param forms array Number of forms given to convertPlural
		 * @param count integer Number of forms required
		 * @return array Padded array of forms
		 */
		'preConvertPlural' : function(forms, count) {
			while (forms.length < count) {
				forms.push(forms[forms.length - 1]);
			}
			return forms;
		},
		/**
		 * Plural form transformations, needed for some languages.
		 *
		 * @param count integer Non-localized quantifier
		 * @param forms array List of plural forms
		 * @return string Correct form for quantifier in this language
		 */
		'convertPlural' : function(count, forms) {
			if (!forms || forms.length === 0) {
				return '';
			}
			return (parseInt(count, 10) === 1 ) ? forms[0] : forms[1];
		},
		/**
		 * Converts a number using digitTransformTable.
		 *
		 * @param {num} number Value to be converted
		 * @param {boolean} integer Convert the return value to an integer
		 */
		'convertNumber' : function(num, integer) {
			if (!this.digitTransformTable) {
				return num;
			}
			// Set the target Transform table:
			var transformTable = this.digitTransformTable, numberString = '' + num, convertedNumber = '';
			// Check if the "restore" to Latin number flag is set:
			if (integer) {
				if (parseInt(num, 10) === num) {
					return num;
				}
				var tmp = [];
				for (var item in transformTable ) {
					tmp[transformTable[i]] = item;
				}
				transformTable = tmp;
			}
			for (var i = 0; i < numberString.length; i++) {
				if (transformTable[numberString[i]]) {
					convertedNumber += transformTable[numberString[i]];
				} else {
					convertedNumber += numberString[i];
				}
			}
			return integer ? parseInt(convertedNumber, 10) : convertedNumber;
		},
		/**
		 * Provides an alternative text depending on specified gender.
		 * Usage {{gender:[gender|user object]|masculine|feminine|neutral}}.
		 * If second or third parameter are not specified, masculine is used.
		 *
		 * These details may be overriden per language.
		 *
		 * @param gender string male, female, or anything else for neutral.
		 * @param forms array List of gender forms
		 *
		 * @return string
		 */
		'gender' : function(gender, forms) {
			if (!forms || forms.length === 0) {
				return '';
			}
			forms =this.preConvertPlural(forms, 2);
			if (gender === 'male') {
				return forms[0];
			}
			if (gender === 'female') {
				return forms[1];
			}
			return (forms.length === 3 ) ? forms[2] : forms[0];
		},
	};
	$.extend($.i18n.language, {
		'default' : language
	});

} )(jQuery);

