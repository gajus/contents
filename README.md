# Table of Contents Generator

Automatically generate table of contents for a given area of content.

```js
$.gajus
    .contents({
        // Reference to the container that will hold the table of contents.
        where: $('#toc'),
        // Reference to the content container.
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

## Table of contents

Table of contents is a list element. The list is nested to represent the heading hierarchy, e.g.

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
        JavaScript

        <ul>
            <li>History</li>
            <li>Trademark</li>
            <li>
                Features

                <ul>
                    <li>Imperative and structured</li>
                    <li>Dynamic</li>
                    <li>Functional</li>
                </ul>
            </li>
            <li>Syntax</li>
        </ul>
    </li>
</ul>
```

## Events

Contents will fire `change.gajus.contents` on the table of contents element when:

1. User loads the page.
2. User navigates to a new section of the page.

The second parameter of the event callback has reference to the current and previous (if any) active heading and anchor.