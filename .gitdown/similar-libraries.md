## Similar Libraries

| Feature | [contents](https://github.com/gajus/contents) | [toc](https://github.com/jgallen23/toc) | [jquery.tocify.js](https://github.com/gfranko/jquery.tocify.js) |
| --- | --- | --- | --- |
| Markup using nested `<ol>` | ✓ | - | - |
| [Smooth scrolling](#smooth-scrolling) | - | ✓ | ✓ |
| Forward and back button support | ✓ | - | ✓ |
| [Events](#events) | ✓ | - | - |
| [Efficient `scroll` event](#window-resize-and-scroll-event-handling) | ✓ | ✓ | - |
| [Reflect `window` resize](#window-resize-and-scroll-event-handling) | ✓ | - | ✓ |
| [Extract table of contents as an array](#table-of-contents-array) | ✓ | - | - |
| Overwrite markup and navigation | ✓ | - | - |
| Can have multiple on a page | ✓ | ✓ | ✓ |
| [Required 3rd party libraries](#required-3rd-party-libraries) | - | jQuery | jQuery, jQueryUI |
| Size | < 5.000 kb | 2.581 kb | 7.246 kb |
| GitHub Stars | 192 | 307 | 435 |

Last updated: Mon Oct 20 13:27:31 2014 UTC.

### Required 3rd Party Libraries

There are no 3rd party dependencies. jQuery selectors are used in the examples to make it simple for the reader.

### Smooth Scrolling

You can implement smooth scrolling using either of the existing libraries. See [Integration Examples](#integration-examples).

### Window Resize and `scroll` Event Handling

The library will index `offsetTop` of all articles. This index is used to reflect the [change event](#events). The index is built upon loading the page, and in response to `window.onresize` and [`ready`](#events) events.

Reading `offsetTop` causes a [reflow](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html). Therefore, this should not be done while scrolling.

# Table of Contents Array

You can extract the table of contents as a collection of nested objects representing the table of contents.

```js
/**
 * @return {array} Array representation of the table of contents.
 */
contents.tree();
```

Tree is a collection of nodes:

```js
[
    // Node
    {
        // Hierarchy level (e.g. h1 = 1)
        level: 1,
        // Id derived using articleId() function.
        id: '',
        // Name derived using articleName() function.
        name: '',
        // The article element.
        element: null,
        // Collection of the descendant nodes.
        descendants: [ /* node */ ]
    }
]
```