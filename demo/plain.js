$(function () {
    var example = $('#plain');

    example.on('ready.example', function () {
        $.gajus
            .contents({
                where: example.find('.table-of-contents'),
                content: example.find('.body')
            })
            .on('resize.gajus.contents', function () {
                console.log('resize.gajus.contents');
            })
            .on('change.gajus.contents', function (event, change) {
                console.groupCollapsed('change.gajus.contents');

                if (change.previous) {
                    change.previous.heading.removeClass('active-heading');
                    change.previous.anchor.removeClass('active-anchor');
                }

                change.current.heading.addClass('active-heading');
                change.current.anchor.addClass('active-anchor');

                console.log('change.previous', change.previous);
                console.log('change.current', change.current);

                console.groupEnd();
            });
    });
});