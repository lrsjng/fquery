# fQuery
File selection and processing for Node.js.
To report a bug or make a feature request please create [a new issue](https://github.com/lrsjng/fquery/issues/new).

References: [web](http://larsjung.de/fquery/), [GitHub](https://github.com/lrsjng/fquery), [npm](https://www.npmjs.org/package/fquery)


## License
The MIT License (MIT)

Copyright (c) 2014 Lars Jung (http://larsjung.de)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


## Changelog


### develop branch

* complete refactoring, not compatible with previous releases
* removes command line tools; makejs is replaced with [mkr](https://github.com/lrsjng/mkr), wepp is gone


### v0.11.0 - *2013-08-16*

* adds `newerThan`
* adds `spawnProcess`
* adds `hash` plugin
* removes `css-condensed`, `live` and `zip` plugin
* adds lazy load for plugins
* minor fixes


### v0.10.0 - *2013-08-09*

* moves `makejs` to a new tools section
* integrates [wepp](http://larsjung.de/wepp/)
* replaces `rmfr` with `DELETE`, no longer needs `I_AM_SURE`
* adds uppercase methods `MOVE`, `COPY`, `WRITE` which overwrite existing files by default
* adds `map` function


### v0.9.0 - *2013-07-31*

* fixes
* updates `async` to `0.2.9`
* updates `clean-css` to `1.0.12`
* updates `commander` to `2.0.0`
* updates `css-condense` to `0.0.6`
* updates `docco` to `0.6.2`
* updates `glob` to `3.2.6`
* updates `handlebars` to `1.0.12`
* updates `jade` to `0.34.1`
* updates `jshint` to `2.1.6`
* updates `less` to `1.4.2`
* updates `mkdirp` to `0.3.5`
* updates `moment` to `2.1.0`
* updates `mustache` to `0.7.2`
* updates `rimraf` to `2.2.2`
* updates `semver` to `2.0.11`
* updates `uglify-js` to `2.3.6`
* updates `underscore` to `1.5.1`


### v0.8.1 - *2012-09-15*

* improves git plugin


### v0.8.0 - *2012-09-13*

* updates version method
* updates git plugin


### v0.7.0 - *2012-09-12*

* adds header option to uglifyjs and cssmin plugin
* adds cleancss plugin
* adds csscondense plugin
* adds githash plugin
* adds shzip plugin
* minor fixes


### v0.6.0 - *2012-08-14*

* adds linebreak option to uglifyjs and cssmin plugin


### v0.5.0 - *2012-08-12*

* adds globs in `includify`


### v0.4.0 - *2012-08-11*

* add plugin handlebars


### v0.3.0 - *2012-08-05*

* interface nearly done


### v0.2.0 - *2012-07-26*

* still initial changes


### v0.1.0 - *2012-07-20*

* initial release

