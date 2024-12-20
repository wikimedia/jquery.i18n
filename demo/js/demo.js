function loadTranslations(callback) {
    var i18n = $.i18n();
    // Load the translation file
    i18n.load('../assets/lang/ui_' + i18n.locale + '.json', i18n.locale).done(function() {
        callback(); // Once translations are loaded, call the callback function
    });
}

function _T(key) {
    'use strict';
    var i18n = $.i18n();
    return i18n(key); // Directly return the translation after it's loaded
}

$(document).ready(function () {
    loadTranslations(function() {
        // Now that translations are loaded, populate the formats object
        var formats = { 
            portrait: _T('text-portrait'), 
            landscape: _T('text-landscape'), 
            square: _T('text-square') 
        };

        $.each(formats, function (key, format) {
            console.log('appending ' + key);
            $('#format').append($('<option>', { 
                value: key,
                text: format
            }));
        });
    });
});
