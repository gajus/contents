# Table of Contents (TOC) Generator

[![Build Status](https://travis-ci.org/gajus/contents.png?branch=master)](https://travis-ci.org/gajus/contents)
[![Bower version](https://badge.fury.io/bo/contents.svg)](http://badge.fury.io/bo/contents)

Automatically generate table of contents for a given area of content.

## Contents

- [Integration Examples](#integration-examples)
    - [Quick Start](#quick-start)
    - [Examples](#examples)
- [Comparison Table](#comparison-table)
- [Download](#download)
- [Settings](#settings)
- [Content Indexing](#content-indexing)
    - [Hierarchy](#hierarchy)
- [Bonding](#bonding)
    - [Article ID](#article-id)
- [Markup](#markup)
- [Events](#events)



## Integration Examples

### Quick Start

To generate a table of contents:

```js
gajus
    .contents({
        contents: $('#contents')
    });
```

The above will generate a table of contents for all of the headings in the document. Table of contents is an (`<ol>`) element; it will be appended to `#contents` container (See [Markup][]).

### Examples

* [Good looking](http://gajus.com/sandbox/contents/example/good-looking/) example.
* [Basic](http://gajus.com/sandbox/contents/example/basic/) table of contents.
* [Smooth scrolling](http://gajus.com/sandbox/contents/example/smooth-scrolling/) implemented using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

The code for all of the examples is in the [example](./example/) folder.

[Raise an issue](https://github.com/gajus/contents/issues) if you are missing an example.

## Comparison Table

| Feature | [contents](https://github.com/gajus/contents) | [toc](https://github.com/jgallen23/toc) | [jquery.tocify.js](https://github.com/gfranko/jquery.tocify.js) |
| --- | --- | --- | --- |
| Markup using nested `<ol>` | ✓ | - | - |
| Smooth scrolling | -<sup>1</sup> | ✓ | ✓ |
| Forward and back button support | ✓ | - | ✓ |
| While-scrolling update of state | ✓ | - | ✓ |
| Events | ✓ | - | - |
| Reflect window resize | ✓ | ✓ | ✓ |
| Overwrite markup and navigation | ✓ | - | - |
| Can have multiple on a page | ✓ | ✓ | ✓ |
| Required 3rd party libraries | jQuery | jQuery | jQuery, jQueryUI |
| Size | 3.552 kb | 2.581 kb | 7.246 kb |
| GitHub Stars | 28 | 307 | 435 |

Last updated: Wed Oct 15 14:06:12 2014 UTC.

<sup>1</sup> You can implement smooth scrolling using either of the existing libraries. See [Integration Examples][].

## Download

Using [Bower](http://bower.io/):

```sh
bower install contents
```

The old-fashioned way, download either of the following files:

* https://raw.githubusercontent.com/gajus/contents/master/dist/contents.min.js
* https://raw.githubusercontent.com/gajus/contents/master/dist/contents.js

## Settings

| Name | Description |
| --- | --- |
| `contents` | Reference to the container that will hold the table of contents. |
| `articles` | (optional) The default behavior is to index all headings (H1-H6) in the document. See [Content Indexing][]. |
| `link` | (optional) Used to represent article in the table of contents and to setup navigation. See [Bonding][]. |

## Content Indexing

The default behavior is to index all headings (H1-H6) in the document.

Use `articles` setting to index content using your own selector:

```js
gajus
    .contents({
        articles: $('main').find('h2, h3')
    });
```

### Hierarchy

`articles` will be used to make the table of contents. `articles` have level of importance. The level of importance determines list nesting (see [Markup][]). For HTML headings, the level of importance is derived from the tag name (`<h[1-6]>`). To set your own level of importance, use `gajus.contents.level` data attribute, e.g.

```js
$('main').find('.summary').data('gajus.contents.level', 4);

gajus
    .contents({
        articles: $('main').find('h1, h2, h3, .summary')
    });
```

When level of importance cannot be determined, it defaults to 1.

## Bonding

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
 * @param {jQuery} guide An element in the table of contents representing an article.
 * @param {jQuery} article The represented content element.
 */
gajus.contents.link = function (guide, article) {
    var guideLink = $('<a>'),
        articleLink = $('<a>'),
        articleName = article.text(),
        articleId = article.attr('id') || gajus.contents.id(articleName);

    guideLink
        .text(articleName)
        .attr('href', '#' + articleId)
        .prependTo(guide);

    articleLink
        .attr('href', '#' + articleId);

    article
        .attr('id', articleId)
        .wrapInner(articleLink);
};
```

To overwrite the default behavior, you can provide your own `link` function as part of the configuration:

```js
gajus
    .contents({
        // Example of implementation that does not wrap
        // article node in a hyperlink.
        link: function (guide, article) {
            var guideLink = $('<a>'),
                articleName = article.text(),
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

Table of contents is an ordered list element. The list is nested to represent the heading hierarchy. The default behavior is to represent each heading using a hyperlink (See [Bonding][]), e.g.

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
| `ready.gajus.contents` | Fired once after the table of contents has been generated. |
| `resize.gajus.contents` | Fired when the page is loaded and in response to "resize" and "orientationchange" window events. |
| `change.gajus.contents` | Fired when the page is loaded and when user navigates to a new section of the page. |

Use the generated list element to listen and trigger events, e.g.

```js
gajus
    .contents({
        // [..]
    })
    .on('change.gajus.contents', function (event, change) {
        if (change.previous) {
            change.previous.article.removeClass('active-article');
            change.previous.guide.removeClass('active-guide');
        }

        change.current.article.addClass('active-article');
        change.current.guide.addClass('active-guide');
    });
    .on('resize.gajus.contents', function (event) {
        
    });
```

The `change.gajus.contents` event listener is passed extra parameters: `.current.article`, `.current.guide`, and when available, `.previous.article`, `.previous.guide`.

You must trigger `resize.gajus.contents` event after programmatically changing the content or the presentation of content, e.g.

```js
gajus
    .contents({
        // [..]
    })
    .trigger('resize.gajus.contents');
```
