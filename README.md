<h1 id="table-of-contents-toc-generator">Table of Contents (TOC) Generator</h1>

[![Travis build status](http://img.shields.io/travis/gajus/contents/master.svg?style=flat)](https://travis-ci.org/gajus/contents)
[![NPM version](http://img.shields.io/npm/v/contents.svg?style=flat)](https://www.npmjs.org/package/contents)
[![Bower version](http://img.shields.io/bower/v/contents.svg?style=flat)](http://bower.io/search/?q=contents)

<!--
[![Tweet Button](./.gitdown/tweet-button.png)](https://twitter.com/intent/tweet?text=%23JavaScript%20library%20to%20generate%20table%20of%20contents%20for%20a%20given%20area%20of%20content.&url=https://github.com/gajus/contents&via=kuizinas)
-->

Table of contents generator.

* [Table of Contents (TOC) Generator](#table-of-contents-toc-generator)
    * [Usage](#table-of-contents-toc-generator-usage)
        * [Quick Start](#table-of-contents-toc-generator-usage-quick-start)
        * [Examples](#table-of-contents-toc-generator-usage-examples)
    * [Introduction of ES6 in 4.0.0](#table-of-contents-toc-generator-introduction-of-es6-in-4-0-0)
    * [Similar Libraries](#table-of-contents-toc-generator-similar-libraries)
        * [Required 3rd Party Libraries](#table-of-contents-toc-generator-similar-libraries-required-3rd-party-libraries)
        * [Smooth Scrolling](#table-of-contents-toc-generator-similar-libraries-smooth-scrolling)
        * [Window Resize and `scroll` Event Handling](#table-of-contents-toc-generator-similar-libraries-window-resize-and-scroll-event-handling)
* [Table of Contents Array](#table-of-contents-array)
    * [Download](#table-of-contents-array-download)
    * [Configuration](#table-of-contents-array-configuration)
    * [Content Indexing](#table-of-contents-array-content-indexing)
        * [Hierarchy](#table-of-contents-array-content-indexing-hierarchy)
    * [Linking](#table-of-contents-array-linking)
        * [Article ID](#table-of-contents-array-linking-article-id)
    * [Markup](#table-of-contents-array-markup)
    * [Events](#table-of-contents-array-events)


<h2 id="table-of-contents-toc-generator-usage">Usage</h2>

<h3 id="table-of-contents-toc-generator-usage-quick-start">Quick Start</h3>

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

<h3 id="table-of-contents-toc-generator-usage-examples">Examples</h3>

* [Good looking](http://gajus.com/sandbox/contents/examples/good-looking/) example.
* [Plain](http://gajus.com/sandbox/contents/examples/plain/) table of contents not using jQuery.
* [Events](http://gajus.com/sandbox/contents/examples/events/) table of contents with all events logged in the `console.log`.
* [Obtain Generated List Element](http://gajus.com/sandbox/contents/examples/list-element/).
* [jQuery](http://gajus.com/sandbox/contents/examples/jquery/) table of contents using jQuery.
* [Smooth scrolling](http://gajus.com/sandbox/contents/examples/smooth-scrolling/) implemented using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

The code for all of the examples is in the [examples](./examples/) folder.

[Raise an issue](https://github.com/gajus/contents/issues) if you are missing an example.
<h2 id="table-of-contents-toc-generator-introduction-of-es6-in-4-0-0">Introduction of ES6 in 4.0.0</h2>

[Similar Libraries](#rimilar-libraries) stats have been generated in 22-Nov-14 08:44:41 UTC. Since then Contents has evolved a lot. The source code is written in ES6 and depends on `babel-core` to run. In projects that already depend on Babel and use webpack to build packages, this is not going to be a problem. Other projects need to consider the relatively heavy weight of the generated package.

<h2 id="table-of-contents-toc-generator-similar-libraries">Similar Libraries</h2>

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
| Size | < 6.000 kb | 2.581 kb | 7.246 kb |
| GitHub Stars | 192 | 307 | 435 |

Last updated: Saturday, 22-Nov-14 08:44:41 UTC.

<h3 id="table-of-contents-toc-generator-similar-libraries-required-3rd-party-libraries">Required 3rd Party Libraries</h3>

There are no 3rd party dependencies. jQuery selectors are used in the examples to make it simple for the reader.

<h3 id="table-of-contents-toc-generator-similar-libraries-smooth-scrolling">Smooth Scrolling</h3>

You can implement smooth scrolling using either of the existing libraries. See [Integration Examples](#integration-examples).

<h3 id="table-of-contents-toc-generator-similar-libraries-window-resize-and-scroll-event-handling">Window Resize and `scroll` Event Handling</h3>

The library will index `offsetTop` of all articles. This index is used to reflect the [change event](#events). The index is built upon loading the page, and in response to `window.onresize` and [`ready`](#events) events.

Reading `offsetTop` causes a [reflow](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html). Therefore, this should not be done while scrolling.

<h1 id="table-of-contents-array">Table of Contents Array</h1>

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

<h2 id="table-of-contents-array-download">Download</h2>

Using [NPM](https://www.npmjs.org/):

```sh
npm install contents
```

Using [Bower](http://bower.io/):

```sh
bower install contents
```
<h2 id="table-of-contents-array-configuration">Configuration</h2>

| Name | Type | Description |
| --- | --- | --- |
| `articles` | `NodeList`, `jQuery` | (optional) The default behavior is to index all headings (H1-H6) in the document. See [Content Indexing](#content-indexing). |
| `link` | `function` | (optional) Used to represent article in the table of contents and to setup navigation. See [Linking](#linking). |
<h2 id="table-of-contents-array-content-indexing">Content Indexing</h2>

The default behavior is to index all headings (H1-H6) in the document.

Use `articles` setting to index content using your own selector:

```js
gajus
    .contents({
        articles: document.querySelectorAll('main h2, main h2')
        // If you are using jQuery
        // articles: $('main').find('h2, h3').get()
    });
```

<h3 id="table-of-contents-array-content-indexing-hierarchy">Hierarchy</h3>

`articles` will be used to make the table of contents. `articles` have level of importance. The level of importance determines list nesting (see [Markup](#markup)). For HTML headings, the level of importance is derived from the tag name (`<h[1-6]>`). To set your own level of importance, use `Contents.level` [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset) property or jQuery data property with the same name, e.g.

```js
$('main').find('.summary').data('gajus.contents.level', 4);

gajus
    .contents({
        articles: $('main').find('h1, h2, h3, .summary').get()
    });
```

When level of importance cannot be determined, it defaults to 1.
<h2 id="table-of-contents-array-linking">Linking</h2>

`link` method is used to represent article in the table of contents and to setup navigation. This method is called once for each article after the list of the table of contents is generated.

The default implementation:

1. Derives ID from the article
2. Generates a hyperlink using article ID as the anchor
3. Appends the URL to the table of contents
4. Wraps the article node in a self-referencing hyperlink.

```js
/**
 * This function is called after the table of contents is generated.
 * It is called for each article in the index.
 * Used to represent article in the table of contents and to setup navigation.
 * 
 * @param {HTMLElement} guide An element in the table of contents representing an article.
 * @param {HTMLElement} article The represented content element.
 */
Contents.link = function (guide, article) {
    var guideLink = document.createElement('a'),
        articleLink = document.createElement('a'),
        articleName = article.innerText,
        articleId = article.id || Contents.id(articleName);

    article.id = articleId;

    articleLink.href = '#' + articleId;

    while (article.childNodes.length) {
        articleLink.appendChild(article.childNodes[0], articleLink);
    }

    article.appendChild(articleLink);

    guideLink.appendChild(document.createTextNode(articleName));
    guideLink.href = '#' + articleId;
    guide.insertBefore(guideLink, guide.firstChild);
};
```

To overwrite the default behavior, you can provide your own `link` function as part of the configuration:

```js
Contents({
    // Example of implementation that does not wrap
    // article node in a hyperlink.
    link: function (guide, article) {
        var guideLink,
            articleName,
            articleId;

        guide = $(guide);
        article = $(article);

        guideLink = $('<a>');
        articleName = article.text();
        articleId = article.attr('id') || Contents.id(articleName);

        guideLink
            .text(articleName)
            .attr('href', '#' + articleId)
            .prependTo(guide);

        article
            .attr('id', articleId);
    }
});
```

<h3 id="table-of-contents-array-linking-article-id">Article ID</h3>

The default implementation relies on each article having an "id" attribute to enable anchor navigation.

If you are overwriting the default `link` implementation, you can take advantage of the `Contents.id` function.

`Contents.id` is responsible for deriving a unique ID from the text of the article, e.g.

```html
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
```

The default `link` implementation will use `Contents.id` to give each article a unique ID:

```html
<h2 id="allow-me-to-reiterate">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-1">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-2">Allow me to reiterate</h2>
```
<h2 id="table-of-contents-array-markup">Markup</h2>

Table of contents is an ordered [list element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol). List nesting reflects the heading hierarchy. The default behavior is to represent each heading using a hyperlink (See [Linking](#linking)), e.g.

```html
<h1>JavaScript</h1>
<h2>History</h2>
<h2>Trademark</h2>
<h2>Features</h2>
<h3>Imperative and structured</h3>
<h3>Dynamic</h3>
<h3>Functional</h3>
<h2>Syntax</h2>
```

Contents will generate the following markup for the above content:

```html
<ol>
    <li>
        <a href="#javascript">JavaScript</a>

        <ol>
            <li>
                <a href="#history">History</a>
            </li>
            <li>
                <a href="#trademark">Trademark</a>
            </li>
            <li>
                <a href="#features">Features</a>

                <ol>
                    <li>
                        <a href="#imperative-and-structured">Imperative and structured</a>
                    </li>
                    <li>
                        <a href="#dynamic">Dynamic</a>
                    </li>
                    <li>
                        <a href="#functional">Functional</a>
                    </li>
                </ol>
            </li>
            <li>
                <a href="#syntax">Syntax</a>
            </li>
        </ol>
    </li>
</ol>
```
<h2 id="table-of-contents-array-events">Events</h2>

| Event | Description |
| --- | --- |
| `ready` | Fired once after the table of contents has been generated. |
| `resize` | Fired when the page is loaded and in response to "resize" and "orientationchange" `window` events. |
| `change` | Fired when the page is loaded and when user navigates to a new section of the page. |

Attach event listeners using the `eventEmitter.on` of the resulting Contents object:

```js
var contents = Contents();

contents.eventEmitter.on('ready', function () {});
contents.eventEmitter.on('resize', function () {});
```

The `change` event listener is passed extra parameters: `.current.article`, `.current.guide`, and when available, `.previous.article`, `.previous.guide`:

```js
contents.eventEmitter.on('change', function (data) {
    if (data.previous) {
        $(data.previous.article).removeClass('active-article');
        $(data.previous.guide).removeClass('active-guide');
    }

    $(data.current.article).addClass('active-article');
    $(data.current.guide).addClass('active-guide');
});
```

You must trigger "resize" event after programmatically changing the content or the presentation of the content.:

```js
contents.eventEmitter.trigger('resize');
```

This is required to recalculate the position of the content.
