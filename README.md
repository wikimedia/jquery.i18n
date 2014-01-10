jQuery.i18n
===========

jQuery.i18n is a jQuery based Javascript internationalization library. This is a project by Wikimedia foundation's [Language Engineering team](http://wikimediafoundation.org/wiki/Language_Engineering_team)

Quick start
-----------

```bash
git clone https://github.com/wikimedia/jquery.i18n.git
```


How to build and test jQuery i18n
----------------------------------

First, get a copy of the git repo by running:

```shell
git clone git://github.com/wikimedia/jquery.i18n.git
```

Make sure you have `grunt` installed by testing:

```shell
grunt -version
```

If not, run:

```shell
npm install -g grunt
```

To run tests locally, run `grunt`, and this will run the tests in PhantomJS.

You can also run the tests in a browser by navigating to the `test/` directory, but first run `grunt` to install submodules.

API
---

## Switching locale

While initializing the `jquery.i18n`, the locale for the page can be given using the `locale` option. For example

```javascript
$.i18n({ 
    locale: 'he' // Locale is Hebrew
});
```

In case locale option is not given, `jquery.i18n` plugin will use the language attribute given for the html tag. For example

```html
<html lang="he" dir="rtl">
```

In this case the locale will be he(Hebrew). If that `lang` attribute is also missing, it will try to use the locale specified by the browser.

It is possible to switch to another locale after plugin is initialized. See below example:

```javascript
$.i18n({ 
    locale: 'he' // Locale is Hebrew
});
$.i18n( 'message_hello' ); // This will give the Hebrew translation of message key `message_hello`. 
$.i18n().locale = 'ml'; // Now onwards locale is 'Malayalam'
$.i18n( 'message_hello' ); // This will give the Malayalam translation of message key `message_hello`. 
```

## Message Loading

JSON formatted messages can be loaded to the plugin using multiple ways.

### Dynamic loading using `load` method.

Following example shows loading messages for two locales- localex, and localey. Here localex and localey are just examples. They should be valid IS0 639 language codes(eg: en, ml, hi, fr, ta etc)
```javascript
$.i18n().load({
	'localex' : {
		'x' : 'X' // Message for localex.
	},
	'localey' : {
		'y' : 'Y' // Message for locale y
	}
});
```

If we want to load the messages for a specific locale, it can be done like this: 
```javascript
$.i18n().load({
    'message_hello' : 'Hello World',
    'message_welcome' : 'Welcome',
}, 'en');
```
Note the second argument for the `load` method. It should be a valid language code.

It is also possible to refer messages from an external URL. See below example

```javascript
$.i18n().load({
	'en' : {
		'message_hello' : 'Hello World',
    		'message_welcome' : 'Welcome'
	},
	'hi' : 'i18n/messages-hi.json', // Messages for Hindi
	'de' : 'i18n/messages-de.json'
});
```

Messages for a locale can be also loaded in parts. Example
```javascript
$.i18n().load({
	'en' : {
		'message_hello' : 'Hello World',
    		'message_welcome' : 'Welcome'
	}
});
$.i18n().load({
    	// This does not remove the previous messages.
	'en' : {
		'message_header' : 'Header',
    		'message_footer' : 'Footer',
    		// This will overwrite message_welcome message
    		'message_welcome' : 'Welcome back'
	}
});
```

Examples
--------

See http://thottingal.in/projects/js/jquery.i18n/demo/

Message format
--------------

## Placeholders

Messages take parameters. They are represented by $1, $2, $3, … in the message texts, and replaced at run time. Typical parameter values are numbers ("Delete 3 versions?"), or user names ("Page last edited by $1"), page names, links, and so on, or sometimes other messages. 

```javascript
var message = "Welcome, $1";
$.i18n(message, 'Alice'); // This gives "Welcome, Alice"
```


## Plurals

To make the syntax of sentence correct, plural forms are required. jquery.i18n support plural forms in the message using the syntax `{{PLURAL:$1|pluralform1|pluralform2|...}}`

For example: 

```javascript
var message = "Found $1 {{PLURAL:$1|result|results}}";
$.i18n(message, 1); // This gives "Found 1 result"
$.i18n(message, 4); // This gives "Found 4 results"
```
Note that {{PLURAL:...}} is not case sensitive. It can be {{plural:...}} too.

In case of English, there are only 2 plural forms, but many languages use more than 2 plural forms. All the plural forms can be given in the above syntax, separated by pipe(|)

## Gender
Similar to plural, depending on gender of placeholders, mostly user names, the syntax changes dynamically. An example in English is "Alice changed her profile picture" and "Bob changed his profile picture". To support this {{GENDER...}} syntax can be used as show in example

```javascript
var message = "$1 changed {{GENDER:$2|his|her}} profile picture";
$.i18n(message, 'Alice', 'female' ); // This gives "Alice changed her profile picture"
$.i18n(message, 'Bob', 'male' ); // This gives "Bob changed his profile picture"
```

Note that {{GENDER:...}} is not case sensitive. It can be {{gender:...}} too.

## Grammar


```javascript
$.i18n( { locale: 'fi' } );

var message = "{{grammar:genitive|$1}}";

$.i18n(message, 'talo' ); // This gives "talon"

$.i18n().locale = 'hy'; // Switch to locale Armenian
$.i18n(message, 'Մաունա'); // This gives "Մաունայի"
```

Specification
-------------

See https://github.com/wikimedia/jquery.i18n/wiki/Specification

Coding style
-------------

Please follow [jQuery coding guidelines](http://docs.jquery.com/JQuery_Core_Style_Guidelines)
