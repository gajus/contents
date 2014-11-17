## Usage

### Quick Start

Generate a table of contents:

```js
var Contents;

Contents = require('contents');

// If you are using ./dist/ version, then Contents is available under "gajus" global property, i.e.
// Contents = gajus.Contents;

Contents({
    // The container element for the table of contents.
    contents: document.querySelector('#contents')
    // If you are using jQuery:
    // contents: $('#contents')[0]
});
```

The above will generate a table of contents for all of the headings in the document. Table of contents is an ordered list element; it will be appended to `#contents` container.

The result of the `Contents()` is an object with properties:

* `list` the generated `<ol>` element. See [Markup](#markup).
* `eventEmitter`. See [Events](#events).

### Examples

* [Good looking](http://gajus.com/sandbox/contents/examples/good-looking/) example.
* [Plain](http://gajus.com/sandbox/contents/examples/plain/) table of contents not using jQuery.
* [Events](http://gajus.com/sandbox/contents/examples/events/) table of contents with all events logged in the `console.log`.
* [Obtain Generated List Element](http://gajus.com/sandbox/contents/examples/list-element/).
* [jQuery](http://gajus.com/sandbox/contents/examples/jquery/) table of contents using jQuery.
* [Smooth scrolling](http://gajus.com/sandbox/contents/examples/smooth-scrolling/) implemented using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

The code for all of the examples is in the [examples](./examples/) folder.

[Raise an issue](https://github.com/gajus/contents/issues) if you are missing an example.