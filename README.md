# Table of Contents (TOC) Generator

[![Build Status](https://travis-ci.org/gajus/contents.png?branch=master)](https://travis-ci.org/gajus/contents)
[![Bower version](https://badge.fury.io/bo/contents.svg?2)](http://badge.fury.io/bo/contents)
[![Tweet Button](./.readme/tweet-button.png?2)](https://twitter.com/intent/tweet?text=%23JavaScript%20library%20to%20generate%20table%20of%20contents%20for%20a%20given%20area%20of%20content.&url=https://github.com/gajus/contents&via=kuizinas)

Automatically generate table of contents for a given area of content.

## Contents

- [Integration Examples](#integration-examples)
    - [Quick Start](#quick-start)
    - [Examples](#examples)
- [Similar Libraries](#similar-libraries)
    - [Required 3rd Party Libraries](#required-rd-party-libraries)
    - [Smooth Scrolling](#smooth-scrolling)
    - [Window Resize and `scroll` Event Handling](#window-resize-and-scroll-event-handling)
- [Download](#download)
- [Settings](#settings)
- [Content Indexing](#content-indexing)
    - [Hierarchy](#hierarchy)
- [Linking](#linking)
    - [Article ID](#article-id)
- [Markup](#markup)
- [Events](#events)



## Integration Examples

### Quick Start

To generate a table of contents:

```js
gajus
    .contents({
        contents: document.querySelector('#contents')
        // If you are using jQuery:
        // contents: $('#contents')[0]
    });
```

The above will generate a table of contents for all of the headings in the document. Table of contents is an (`<ol>`) element; it will be appended to `#contents` container (See [Markup](#markup)).

The result of the `gajus.contents()` is an object with `list` (the generated `<ol>` element) and [`eventProxy`](#events) properties.

### Examples

* [Good looking](http://gajus.com/sandbox/contents/example/good-looking/) example.
* [Plain](http://gajus.com/sandbox/contents/example/plain/) table of contents not using jQuery.
* [Events](http://gajus.com/sandbox/contents/example/events/) table of contents with all events logged in the `console.log`.
* [Obtain Generated List Element](http://gajus.com/sandbox/contents/example/list-element/).
* [jQuery](http://gajus.com/sandbox/contents/example/jquery/) table of contents using jQuery.
* [Smooth scrolling](http://gajus.com/sandbox/contents/example/smooth-scrolling/) implemented using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

The code for all of the examples is in the [example](./example/) folder.

[Raise an issue](https://github.com/gajus/contents/issues) if you are missing an example.

## Similar Libraries

| Feature | [contents](https://github.com/gajus/contents) | [toc](https://github.com/jgallen23/toc) | [jquery.tocify.js](https://github.com/gfranko/jquery.tocify.js) |
| --- | --- | --- | --- |
| Markup using nested `<ol>` | ✓ | - | - |
| [Smooth scrolling](#smooth-scrolling) | - | ✓ | ✓ |
| Forward and back button support | ✓ | - | ✓ |
| [Events](#events) | ✓ | - | - |
| [Efficient `scroll` event](#window-resize-and-scroll-event-handling) | ✓ | ✓ | - |
| [Reflect window resize](#window-resize-and-scroll-event-handling) | ✓ | - | ✓ |
| Overwrite markup and navigation | ✓ | - | - |
| Can have multiple on a page | ✓ | ✓ | ✓ |
| [Required 3rd party libraries](#required-3rd-party-libraries) | - | jQuery | jQuery, jQueryUI |
| Size | 5.000 kb | 2.581 kb | 7.246 kb |
| GitHub Stars | 71 | 307 | 435 |

Last updated: Mon Oct 20 13:27:31 2014 UTC.

### Required 3rd Party Libraries

There are no 3rd party dependencies. jQuery selectors are used in the examples to make it simple for the reader.

### Smooth Scrolling

You can implement smooth scrolling using either of the existing libraries. See [Integration Examples](#integration-examples).

### Window Resize and `scroll` Event Handling

The library will index `offsetTop` of all articles. This index is used to reflect the [change event](#events). The index is built upon loading the page, and in response to `window.onresize` and [`ready`](#events) events.

Reading `offsetTop` causes a [reflow](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html). Therefore, this should not be done while scrolling.

## Download

Using [Bower](http://bower.io/):

```sh
bower install contents
```

The old-fashioned way, download either of the following files:

* https://raw.githubusercontent.com/gajus/contents/master/dist/contents.min.js
* https://raw.githubusercontent.com/gajus/contents/master/dist/contents.js

## Settings

| Name | Type | Description |
| --- | --- | --- |
| `contents` | `HTMLElement`, `jQuery` | Parent element for the table of contents. |
| `articles` | `NodeList`, `jQuery` | (optional) The default behavior is to index all headings (H1-H6) in the document. See [Content Indexing](#content-indexing). |
| `link` | `function` | (optional) Used to represent article in the table of contents and to setup navigation. See [Linking](#linking). |

## Content Indexing

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

### Hierarchy

`articles` will be used to make the table of contents. `articles` have level of importance. The level of importance determines list nesting (see [Markup](#markup)). For HTML headings, the level of importance is derived from the tag name (`<h[1-6]>`). To set your own level of importance, use `gajus.contents.level` [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset) property or jQuery data property with the same name, e.g.

```js
$('main').find('.summary').data('gajus.contents.level', 4);

gajus
    .contents({
        articles: $('main').find('h1, h2, h3, .summary').get()
    });
```

When level of importance cannot be determined, it defaults to 1.

## Linking

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
gajus.contents.link = function (guide, article) {
    var guideLink = document.createElement('a'),
        articleLink = document.createElement('a'),
        articleName = article.innerText,
        articleId = article.id || gajus.contents.id(articleName);

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
gajus
    .contents({
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
            articleId = article.attr('id') || gajus.contents.id(articleName);

            guideLink
                .text(articleName)
                .attr('href', '#' + articleId)
                .prependTo(guide);

            article
                .attr('id', articleId);
        }
    });
```

### Article ID

The default implementation relies on each article having an "id" attribute to enable anchor navigation.

If you are overwriting the default `link` implementation, you can take advantage of the `gajus.contents.id` function.

`gajus.contents.id` is responsible for deriving a unique ID from the text of the article, e.g.

```html
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
```

The default `link` implementation will use `gajus.contents.id` to give each article a unique ID:

```html
<h2 id="allow-me-to-reiterate">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-1">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-2">Allow me to reiterate</h2>
```

## Markup

Table of contents is an ordered list element. The list is nested to represent the heading hierarchy. The default behavior is to represent each heading using a hyperlink (See [Linking](#linking)), e.g.

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

The above content will generate the following table of contents:

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

## Events

| Event | Description |
| --- | --- |
| `ready` | Fired once after the table of contents has been generated. |
| `resize` | Fired when the page is loaded and in response to "resize" and "orientationchange" window events. |
| `change` | Fired when the page is loaded and when user navigates to a new section of the page. |

The events are accessible via `eventProxy` property of the resulting object, e.g.

```js
var contents = gajus
    .contents({
        // [..]
    });

contents.eventProxy.on('ready', function () {});
contents.eventProxy.on('resize', function () {});
```

The `change` event listener is passed extra parameters: `.current.article`, `.current.guide`, and when available, `.previous.article`, `.previous.guide`:

```js
contents.eventProxy.on('change', function (data) {
    if (data.previous) {
        $(data.previous.article).removeClass('active-article');
        $(data.previous.guide).removeClass('active-guide');
    }

    $(data.current.article).addClass('active-article');
    $(data.current.guide).addClass('active-guide');
});
```

You must trigger `resize` event after programmatically changing the content or the presentation of the content, e.g.

```js
contents.eventProxy.trigger('resize');
```
