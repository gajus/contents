$(function () {
    var example = $('#plain');

    example.on('ready.example', function () {
        $.gajus
            .contents({
                where: example.find('.table-of-contents'),
                content: example.find('.body')
            })
            .on('change.gajus.contents', function (event, change) {
                if (change.previous) {
                    change.previous.heading.removeClass('active-heading');
                    change.previous.anchor.removeClass('active-anchor');
                }

                change.current.heading.addClass('active-heading');
                change.current.anchor.addClass('active-anchor');
            });
    });
});