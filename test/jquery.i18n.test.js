/* global pluralRuleParser, QUnit, jQuery */
(function($) {
	module('jquery.i18n en', {
		setup : function() {
			$.i18n({
				locale : 'en'
			});
		},
		teardown : function() {
			$.i18n().destroy();
		}
	});
	test("Message parse tests", function(assert) {
		assert.strictEqual($.i18n("message_1"), "ONE", "Simple message");
		assert.strictEqual($.i18n("This message key does not exist"), "This message key does not exist", "This message key does not exist");
		assert.strictEqual($.i18n("Hello $1", "Bob"), "Hello Bob", "Parameter replacement");
		assert.strictEqual($.i18n("$1 has $2 {{plural:$2|kitten|kittens}}. {{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.", "Meera", 1, "female"), "Meera has 1 kitten. She loves to play with it.", "Plural and gender test" );
		assert.strictEqual($.i18n("$1 has $2 {{plural:$2|kitten|kittens}}. {{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.", "Harry", 2, "male"), "Harry has 2 kittens. He loves to play with them.", "Plural and gender test" );
	});
	module('jquery.i18n Malayalam', {
		setup : function() {
			$.i18n({
				locale : 'ml'
			});
		},
		teardown : function() {
			$.i18n().destroy();
		}
	});
	test("Message parse tests", function(assert) {
		assert.strictEqual($.i18n("message_1"), "ഒന്ന്", "Simple message");
		assert.strictEqual($.i18n("This message key does not exist"), "This message key does not exist", "This message key does not exist");
		assert.strictEqual($.i18n("Hello $1", "Bob"), "Hello Bob", "Parameter replacement");
		assert.strictEqual($.i18n("$1 has $2 {{plural:$2|kitten|kittens}}. {{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.", "മീര", 1, "female"), "മീരയ്ക്ക് ഒരു പൂച്ചക്കുട്ടി ഉണ്ടു്. അവള്‍ അതുമായി കളിക്കാന്‍ ഇഷ്ടപ്പെടുന്നു.", "Plural and gender test" );
		assert.strictEqual($.i18n("$1 has $2 {{plural:$2|kitten|kittens}}. {{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.", "ഹാരി", 2, "male"), "ഹാരിയ്ക്ക് 2 പൂച്ചക്കുട്ടികള്‍ ഉണ്ടു്. അവന്‍ അവറ്റകളുമായി കളിക്കാന്‍ ഇഷ്ടപ്പെടുന്നു.", "Plural and gender test" );
	});
})(window.jQuery);