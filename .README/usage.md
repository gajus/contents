## Usage

### Quick Start

```js
var Contents,
    contents,
    newHeading;

Contents = require('contents');

// If you are using ./dist/ version, then Contents is available under "gajus" global property, i.e.
// Contents = gajus.Contents;

// This example generates a table of contents for all of the headings in the document.
// Table of contents is an ordered list element.
contents = Contents();

// Append the generated list element (table of contents) to the container.
document.querySelector('#your-table-of-contents-container').appendChild(contents.list());

// Attach event listeners:
contents.eventEmitter().on('change', function () {
    console.log('User has navigated to a new section of the page.');
});

// The rest of the code illustrates firing "resize" event after you have
// added new content after generating the table of contents.
newHeading = document.createElement('h2');
hewHeading.innerHTML = 'Dynamically generated title';

document.body.appendChild(newHeading);

// Firing the "resize" event will regenerate the table of contents.
contents.eventEmitter().trigger('resize');
```

### Examples

* [Good looking](http://gajus.com/sandbox/contents/examples/good-looking/) example.
* [Plain](http://gajus.com/sandbox/contents/examples/plain/) table of contents not using jQuery.
* [Events](http://gajus.com/sandbox/contents/examples/events/) table of contents with all events logged in the `console.log`.
* [Obtain Generated List Element](http://gajus.com/sandbox/contents/examples/list-element/).
* [jQuery](http://gajus.com/sandbox/contents/examples/jquery/) table of contents using jQuery.
* [Smooth scrolling](http://gajus.com/sandbox/contents/examples/smooth-scrolling/) implemented using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

The code for all of the examples is in the [examples](./examples/) folder.

[Raise an issue](https://github.com/gajus/contents/issues) if you are missing an example.