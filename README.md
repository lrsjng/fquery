# fQuery

[![license][license-img]][github] [![web][web-img]][web] [![github][github-img]][github] [![npm][npm-img]][npm]  
[![version][npm-v-img]][npm] [![downloads][npm-dm-img]][npm] [![dependencies status][david-img]][david] [![build status][travis-img]][travis]

File selection and processing for Node.js.

**currently under development, rapid changes, incompatible to previous releases**


## Method Naming Conventions

* getters start with `get` and return a value (`getSomething`)
* getters start with `is` if they return a boolean value (`isSomething`)
* sync operations return `this` (`doSomething`)
* async operations start with `async` and return a `promise` (`asyncDoSomething`)
* queued operations start with `then` and return `this` (`thenDoSomething`)
* some environment enforced method names might differ from these conventions (`toString`, `inspect`, ...)


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


[web]: http://larsjung.de/fquery/
[github]: https://github.com/lrsjng/fquery
[npm]: https://www.npmjs.org/package/fquery
[david]: https://david-dm.org/lrsjng/fquery
[travis]: https://travis-ci.org/lrsjng/fquery

[license-img]: http://img.shields.io/badge/license-MIT-a0a060.svg?style=flat-square
[web-img]: http://img.shields.io/badge/web-larsjung.de/fquery-a0a060.svg?style=flat-square
[github-img]: http://img.shields.io/badge/github-lrsjng/fquery-a0a060.svg?style=flat-square
[npm-img]: http://img.shields.io/badge/npm-fquery-a0a060.svg?style=flat-square

[npm-v-img]: http://img.shields.io/npm/v/fquery.svg?style=flat-square
[npm-dm-img]: http://img.shields.io/npm/dm/fquery.svg?style=flat-square
[david-img]: http://img.shields.io/david/lrsjng/fquery.svg?style=flat-square
[travis-img]: http://img.shields.io/travis/lrsjng/fquery.svg?style=flat-square
