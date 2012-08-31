jQuery based Javascript internationalization library
====================================================


Quick start
-----------

```bash
git clone https://github.com/wikimedia/jquery.i18n.git
```

Documentation
-------------

For documentation and examples please visit the [wiki](https://github.com/wikimedia/jquery.i18n/wiki/_pages)


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

Coding style
-------------

Please follow [jQuery coding guidelines](http://docs.jquery.com/JQuery_Core_Style_Guidelines)

Versioning
----------

For transparency and insight into the release cycle, and to upgrading easier,
we use the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit http://semver.org/.
