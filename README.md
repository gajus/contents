# Table of Contents (TOC) Generator

Automatically generate table of contents for a given area of content.

## Settings

| Name | Type | Description |
| --- | --- | --- |
| `where` | `jQuery` | Reference to the container that will hold the table of contents. |
| `content` | `jQuery` | Reference to the content container. |
| `slug` | `function (headingText)` | Function used to derive heading ID (anchor name). Must return `string`. Defaults to `$.gajus.contents.slug`. |
| `offset` | `function ()` |  |

## Events

Contents will fire `change.gajus.contents` on the table of contents element when:

1. User loads the page.
2. User navigates to a new section of the page.

The second parameter of the event callback has reference to the current and previous (if any) active heading and anchor.

### Example

```js
$.gajus
    .contents({
        where: $('#toc'),
        content: $('article')
    })
    .on('change.gajus.contents', function (event, change) {
        if (change.previous) {
            change.previous.heading.removeClass('active-heading');
            change.previous.anchor.removeClass('active-anchor');
        }

        change.current.heading.addClass('active-heading');
        change.current.anchor.addClass('active-anchor');
    });
```

## Markup

Table of contents is a list element. The list is nested to represent the heading hierarchy. The default behavior is to represent each heading using a hyperlink, e.g.

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
<ul>
    <li>
        <a href="javascript">JavaScript</a>

        <ul>
            <li>
                <a href="javascript">History</a>
            </li>
            <li>
                <a href="trademark">Trademark</a>
            </li>
            <li>
                <a href="features">Features</a>

                <ul>
                    <li>
                        <a href="imperative-and-structured">Imperative and structured</a>
                    </li>
                    <li>
                        <a href="dynamic">Dynamic</a>
                    </li>
                    <li>
                        <a href="functional">Functional</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="syntax">Syntax</a>
            </li>
        </ul>
    </li>
</ul>
```

### Item Interpreter

The default item interpreter implementation:

1. Wraps text of each heading in a hyperlink element.
2. Uses heading "id" attribute to link hyperlink to the heading anchor.
3. Appends the hyperlink to the list.

```js
/**
 * @param {jQuery} li List element.
 * @param {jQuery} heading Heading element.
 */
$.gajus.contents.generateHeadingHierarchyList.itemFormatter = function (li, heading) {
    var hyperlink = $('<a>');

    hyperlink.text(heading.text());
    hyperlink.attr('href', '#' + heading.attr('id'));

    li.append(hyperlink);
};
```

You can overwrite this behavior using a custom `itemFormatter` function:

```js
$.gajus
    .contents({
        itemFormatter: function (li, heading) {}
    });
```

### Anchor Name

The default implementation relies on each heading having an "id" attribute to enable anchor navigation. If heading does not have "id", `$.gajus.contents.anchorFormatter` will be used to derive the value from the heading text.

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

You can overwrite this behavior using a custom `anchorFormatter` function:

```js
$.gajus
    .contents({
        anchorFormatter: function (str) {}
    });
```

#### Solving ID Conflicts

If there are multiple headings with the same name, e.g.

```html
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
<h2>Allow me to reiterate</h2>
```

The mechanism responsible for ensuring that only unique IDs are assigned will suffix each value with an incremental index.

```html
<h2 id="allow-me-to-reiterate">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-1">Allow me to reiterate</h2>
<h2 id="allow-me-to-reiterate-2">Allow me to reiterate</h2>
```

This action is performed after `anchorFormatter`.