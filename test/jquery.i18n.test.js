/* global pluralRuleParser, QUnit, jQuery */
(function($, QUnit) {
	QUnit.module('jquery.i18n', {
		setup : function() {
			$.i18n({
				locale : 'en'
			}).load('i18n/test-en.json');
		},
		teardown : function() {
		}
	});
	QUnit.test("Message parse tests", function(assert) {
		assert.strictEqual($.i18n("message_1"), "ONE", "Simple message");
		assert.strictEqual($.i18n("This message key does not exist"), "This message key does not exist", "This message key does not exist");
		assert.strictEqual($.i18n("Hello $1", "Bob"), "Hello Bob", "Parameter replacement");
		assert.strictEqual($.i18n("User $1 has $2 points in $3 games", "Bob", 4, 5), "User Bob has 4 points in 5 games", "More parameter replacement");
	});
	QUnit.test("Messages with plural parse tests", function(assert) {
		assert.strictEqual($.i18n("Found $1 {{plural:$1|result|results}}", 0), "Found 0 results", "More parameter replacement");
		assert.strictEqual($.i18n("Found $1 {{plural:$1|result|results}}", 1), "Found 1 result", "More parameter replacement");
		assert.strictEqual($.i18n("Found $1 {{plural:$1|result|results}}", 10), "Found 10 results", "More parameter replacement");
		assert.strictEqual($.i18n("User $1 changed {{gender:$2|his|her}} preferences", 'Santhosh', 'male'), "User Santhosh changed his preferences", "More parameter replacement");
	});
	QUnit.test("Messages with gender parse tests", function(assert) {
		assert.strictEqual($.i18n("User $1 changed {{gender:$2|his|her}} preferences", 'Santhosh', 'male'), "User Santhosh changed his preferences", "Gender test");
	});
})(window.jQuery, window.QUnit);