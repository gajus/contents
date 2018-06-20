## Events

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