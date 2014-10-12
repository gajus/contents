# Table of Contents (TOC) Generator

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
            <li><a href="javascript">History</a></li>
            <li><a href="trademark">Trademark</a></li>
            <li>
                <a href="features">Features</a>

                <ul>
                    <li><a href="imperative-and-structured">Imperative and structured</a></li>
                    <li><a href="dynamic">Dynamic</a></li>
                    <li><a href="functional">Functional</a></li>
                </ul>
            </li>
            <li><a href="syntax">Syntax</a></li>
        </ul>
    </li>
</ul>
```

### Item Interpreter

[..]

### Anchor Name

[..]

## Events

Contents will fire `change.gajus.contents` on the table of contents element when:

1. User loads the page.
2. User navigates to a new section of the page.

The second parameter of the event callback has reference to the current and previous (if any) active heading and anchor.