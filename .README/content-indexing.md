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

`articles` will be used to make the table of contents. `articles` have level of importance. The level of importance determines list nesting (see [Markup](#markup)). For HTML headings, the level of importance is derived from the tag name (`<h[1-6]>`). To set your own level of importance, use `Contents.level` [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset) property or jQuery data property with the same name, e.g.

```js
$('main').find('.summary').data('gajus.contents.level', 4);

gajus
    .contents({
        articles: $('main').find('h1, h2, h3, .summary').get()
    });
```

When level of importance cannot be determined, it defaults to 1.