# Table of Contents (TOC) Generator

[![Build Status](https://travis-ci.org/gajus/contents.png?branch=master)](https://travis-ci.org/gajus/contents)

Automatically generate table of contents for a given area of content.

## Contents

- [Integration Examples](#integration-examples)
    - [Quick Start](#quick-start)
    - [Examples](#examples)
- [Comparison Table](#comparison-table)
- [Download](#download)
- [Settings](#settings)
- [Content Index](#content-index)
- [Events](#events)
- [Markup](#markup)
    - [Item Formatter](#item-formatter)
    - [Anchor Name](#anchor-name)
        - [Solving ID Conflicts](#solving-id-conflicts)
- [Offset Line of Sight](#offset-line-of-sight)



## Integration Examples

### Quick Start

To generate a table of contents:

```js
$.gajus
    .contents({
        where: $('#table-of-contents'),
        content: $('main')
    });
```

The above will generate a table of contents for headings in `main`. Table of contents is an (`<ol>`) element; it will be appended to `#table-of-contents` container.

### Examples

* [Table of contents](http://gajus.com/sandbox/contents/example/) for the Wikipedia article about JavaScript.
* [Smooth scrolling](http://gajus.com/sandbox/contents/example/smooth-scrolling.html) implemented using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

The code for all of the examples is in the [example](./example/) folder.

## Comparison Table

| Feature | [contents](https://github.com/gajus/contents) | [toc](https://github.com/jgallen23/toc) | [jquery.tocify.js](https://github.com/gfranko/jquery.tocify.js) |
| --- | --- | --- | --- |
| Markup using nested `<ol>` | ✓ | - | - |
| Smooth scrolling | -<sup>1</sup> | ✓ | ✓ |
| Forward and back button support | ✓ | - | ✓ |
| While-scrolling update of state | ✓ | - | ✓ |
| Events | ✓ | - | - |
| Reflect window resize | ✓ | ✓ | ✓ |
| Extendable item formatter | ✓ | - | - |
| Extendable anchor name formatter | ✓ | ✓ | ✓ |
| Dynamically "eye-sight" offset | ✓ | - | - |
| Can have multiple on a page | ✓ | ✓ | ✓ |
| Number of test cases | 44 | 14 | 10 |
| Required 3rd party libraries | jQuery | jQuery | jQuery, jQueryUI |
| Size | 5.075 kb | 2.581 kb | 7.246 kb |
| GitHub Stars | 21 | 307 | 435 |

Last updated: Tue Oct 14 10:31:52 2014 UTC.

<sup>1</sup> You can implement smooth scrolling using either of the existing libraries. See [integration examples](#integration-examples) section of the page for smooth scrolling implementation using [jquery-smooth-scroll](https://github.com/kswedberg/jquery-smooth-scroll).

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
| `where` | Reference to the container that will hold the table of contents. |
| `content` | Reference to the content container. |
| `index` | Reference to the headings. |
| | Either `content` or `index` property must be set.  See [Content Index](#content-index). |
| `itemFormatter` | (optional) Used to represent each item in the table of contents and format the corresponding heading. See [Item Formatter](#item-formatter). |
| `anchorFormatter` | (optional) Used to derive the anchor name from the heading text. See [Anchor Name](#anchor-name). |
| `offsetCalculator` | (optional) Used to calculate the "line of sight". See [Offset Line of Sight](#offset-line-of-sight). |

## Content Index

The default behavior is to index all headings (H1-H6) in the `content` container:

```js
$.gajus
    .contents({
        content: $('main')
    });
```

You can use your own selector to identify headings:

```js
$.gajus
    .contents({
        index: $('h2, h3')
    });
```

## Events

| Event | Description |
| --- | --- |
| `ready.gajus.contents` | Triggered once after the table of contents has been generated. |
| `resize.gajus.contents` | Triggered when the page is loaded and in response to "resize" and "orientationchange" window events. |
| `change.gajus.contents` | Triggered when the page is loaded and when user navigates to a new section of the page. |

Use the generated list element to listen and trigger events, e.g.

```js
$.gajus
    .contents({
        // [..]
    })
    .on('change.gajus.contents', function (event, change) {
        if (change.previous) {
            change.previous.heading.removeClass('active-heading');
            change.previous.anchor.removeClass('active-anchor');
        }

        change.current.heading.addClass('active-heading');
        change.current.anchor.addClass('active-anchor');
    });
    .on('resize.gajus.contents', function (event) {
        
    });
```

You must trigger `resize.gajus.contents` event after programmatically changing the content or the presentation of content, e.g.

```js
$.gajus
    .contents({
        // [..]
    })
    .trigger('resize.gajus.contents');
```

## Markup

Table of contents is an ordered list element. The list is nested to represent the heading hierarchy. The default behavior is to represent each heading using a hyperlink, e.g.

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

### Item Formatter

`itemFormatter` is used to represent each item in the table of contents and format the corresponding heading.

The default item formatter implementation will:

1. Generate a hyperlink for each item in the list using the "id" of the heading element.
2. Turn each heading into a hyperlink with a self-reference.

```js
/**
 * @param {jQuery} li List element.
 * @param {jQuery} heading Heading element.
 */
$.gajus.contents.itemFormatter = function (li, heading, anchorName) {
    var headingLink = $('<a>'),
        listlink = $('<a>');

    listlink.text(heading.text());
    listlink.attr('href', '#' + heading.attr('id'));

    li.append(listlink);

    headingLink.attr('href', '#' + heading.attr('id'));

    heading.wrapInner(headingLink);
};
```

### Anchor Name

The default implementation relies on each heading having an "id" attribute to enable anchor navigation. If heading does not have an "id", `$.gajus.contents.anchorFormatter` will be used to derive the anchor name from the heading text.

```js
/**
 * Format text into ID/anchor safe value.
 *
 * @see http://stackoverflow.com/a/1077111/368691
 * @param {String} str Arbitrary string.
 * @return {String}
 */
$.gajus.contents.anchorFormatter = function (str) {
    return str
        .toLowerCase()
        .replace(/[ãàáäâ]/g, 'a')
        .replace(/[ẽèéëê]/g, 'e')
        .replace(/[ìíïî]/g, 'i')
        .replace(/[õòóöô]/g, 'o')
        .replace(/[ùúüû]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]+/g, '-')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '')
        .replace(/^[^a-z]+/g, '');
};
```

#### Solving ID Conflicts

If there are multiple headings with the same name, e.g.

```html
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
```

The mechanism responsible for ensuring that only unique IDs are assigned will suffix each value with an incremental index:

```html
<h2 id="allow-me-to-reiterate">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-1">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-2">Allow me to reiterate</h2>
```

This operation is performed after `anchorFormatter`.

## Offset Line of Sight

The content is considered "in sight" when the heading is at or above the "line of sight". This line of sight can be either top of the page or an arbitrary offset.

The default behavior is to calculate the line of sight as 1/3 of the window height.

```js
/**
 * @return {Number}
 */
$.gajus.contents.offsetIndex.offsetCalculator = function () {
    return $(window).height() / 3;
};
```

The function to calculate the line of sight is called upon initiation and in response to `resize.contents.gajus` event.
