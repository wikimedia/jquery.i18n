// Assuming i18n is some object and its methods need to be handled manually, 
// if you are using a library for i18n, the load mechanism might be similar
function loadTranslations(callback) {
    // Assuming i18n is an object with a load method
    const i18n = { 
        locale: 'en', // Replace with dynamic locale if needed
        load: function(url, locale) {
            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.translations = data;
                });
        },
        get: function(key) {
            return this.translations[key] || key; // Return the translation or the key itself if not found
        }
    };

    // Load the translation file
    i18n.load('../assets/lang/ui_' + i18n.locale + '.json', i18n.locale)
        .then(function() {
            callback(); // Once translations are loaded, call the callback function
        });
}

function _T(key) {
    'use strict';
    const i18n = { translations: {} }; // Assuming i18n object
    return i18n.get(key); // Directly return the translation after it's loaded
}

document.addEventListener('DOMContentLoaded', function () {
    loadTranslations(function() {
        // Now that translations are loaded, populate the formats object
        const formats = { 
            portrait: _T('text-portrait'), 
            landscape: _T('text-landscape'), 
            square: _T('text-square') 
        };

        // Instead of $.each(), use Object.keys() and forEach() in vanilla JS
        Object.keys(formats).forEach(function(key) {
            console.log('appending ' + key);
            const option = document.createElement('option');
            option.value = key;
            option.textContent = formats[key];
            document.getElementById('format').appendChild(option);
        });
    });
});
