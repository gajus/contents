# Table of Contents (TOC) Generator

[![Build Status](https://travis-ci.org/gajus/contents.png?branch=master)](https://travis-ci.org/gajus/contents)

Automatically generate table of contents for a given area of content.

## Contents

- [Demo](#demo)
- [Settings](#settings)
- [Content Index](#content-index)
- [Events](#events)
- [Markup](#markup)
    - [Item Formatter](#item-formatter)
    - [Anchor Name](#anchor-name)
        - [Solving ID Conflicts](#solving-id-conflicts)
- [Offset Line of Sight](#offset-line-of-sight)



## Demo

* [Table of contents](http://gajus.com/sandbox/contents/demo/) for the Wikipedia article about JavaScript.

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
| `change.contents.gajus` | Triggered when the page is loaded and when user navigates to a new section of the page. |
| `resize.contents.gajus` | Triggered when the page is loaded and in response to "resize" and "orientationchange" window events. |

Use the generated list element to listen and trigger events, e.g.

```js
$.gajus
    .contents({
        // [..]
    })
    .on('change.contents.gajus', function (event, change) {
        if (change.previous) {
            change.previous.heading.removeClass('active-heading');
            change.previous.anchor.removeClass('active-anchor');
        }

        change.current.heading.addClass('active-heading');
        change.current.anchor.addClass('active-anchor');
    });
    .on('resize.contents.gajus', function (event) {
        
    });
```

You must trigger `resize.contents.gajus` event after programmatically changing the content or the presentation of content, e.g.

```js
$.gajus
    .contents({
        // [..]
    })
    .trigger('resize.contents.gajus');
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
