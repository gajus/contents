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

### Article ID

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