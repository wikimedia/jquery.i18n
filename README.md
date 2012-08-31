jQuery based Javascript internationalization library
====================================================


Quick start
-----------

```bash
git clone https://github.com/wikimedia/jquery.i18n.git
```

Documentation
-------------


Test
----
Before you can run the tests, make sure the submodules are updated:
```
git submodule update --init
```

Then open up `./test/index.html` in your browser.

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
