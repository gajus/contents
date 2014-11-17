var gc = gajus.Contents;
describe('DOM dependent method', function () {
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/page.html']));
    });
    describe('.id()', function () {
        it('uses the formatId function', function () {
            expect(gc.id('', function () { return 'ok'; })).toEqual('ok');
        });
        it('throws an error if formattedId is invalid', function () {
            expect(function () {
                expect(gc.id('', function () { return '-ok'; }));
            }).toThrowError('Invalid ID.');
        });
        it('derives a unique ID', function () {
            expect(gc.id('id-not-unique')).toEqual('id-not-unique-1');
        });
    });
    describe('.level()', function () {
        it('derives level for heading element', function () {
            expect(gc.level($('<h1>')[0])).toEqual(1);
        });
        describe('when element is not heading', function () {
            var element;
            beforeEach(function () {
                element = $('<foo>');
            });
            it('defaults to 1', function () {
                expect(gc.level(element[0])).toEqual(1);
            });
            it('uses gajus.contents.level dataset property', function () {
                element[0].dataset['gajus.contents.level'] = 2;

                expect(gc.level(element[0])).toEqual(2);
            });
            it('uses use jQuery gajus.contents.level dataset property', function () {
                element.data('gajus.contents.level', 3);

                expect(gc.level(element[0])).toEqual(3);
            });
        });
    });
    describe('.link()', function () {
        var guide,
            article;
        beforeEach(function () {
            guide = $('#link .guide');
            article = $('#link .article');
            gc.link(guide[0], article[0]);
        });
        it('uses existing article id', function () {
            guide = $('#link .guide');
            article = $('#link-bar');
            gc.link(guide[0], article[0]);
            expect(article.attr('id')).toEqual('link-bar');
        });
        it('gives article an id', function () {
            expect(article.attr('id')).toEqual('foo');
        });
        it('wraps article content in a hyperlink', function () {
            expect(article.html()).toEqual('<a href="#foo">foo</a>');
        });
        it('appends a hyperlink to the guide', function () {
            expect(guide.html()).toEqual('<a href="#foo">foo</a>');
        });
    });
    describe('.indexOffset()', function () {
        var offsetIndex;
        beforeEach(function () {
            offsetIndex = gc.indexOffset(document.querySelectorAll('#index_offset div'));
        });
        it('returns vertical offset of all elements', function () {
            expect(offsetIndex).toEqual([0, 100, 200]);
        });
    });
    describe('.makeList()', function () {
        it('represents a flat structure', function () {
            var list = gc.makeList(document.querySelectorAll('#make_list-flat p'), function () {});

            expect(list.outerHTML).toEqual('<ol><li></li><li></li><li></li></ol>');
        });
        it('represents an increasing hierarchy', function () {
            var list = gc.makeList($('#make_list-increasing_hierarchy').find('h1, h2, h3').get(), function () {});

            expect(list.outerHTML).toEqual('<ol><li><ol><li><ol><li></li></ol></li></ol></li></ol>');
        });
        it('represents a decreasing hierarchy', function () {
            var list = gc.makeList($('#make_list-decreasing_hierarchy').find('h1, h2, h3').get(), function () {});

            expect(list.outerHTML).toEqual('<ol><li><ol><li><ol><li></li></ol></li><li></li></ol></li></ol>');
        });
    });
});
ddescribe('DOM independent method', function () {
    describe('.getIndexOfClosestValue()', function () {
        it('throws an error when the haystack is empty', function () {
            expect(function () {
                gc.getIndexOfClosestValue(1, []);
            }).toThrowError('Haystack must be not empty.');
        });
        it('returns index of the first value when haystack length is 1', function () {
            expect(gc.getIndexOfClosestValue(1, [100])).toEqual(0);
        });
        it('rounds down to the nearest value', function () {
            expect(gc.getIndexOfClosestValue(12, [1, 10, 20])).toEqual(1);
        });
        it('returns index of the exact value', function () {
            expect(gc.getIndexOfClosestValue(10, [1, 10, 20])).toEqual(1);
        });
        it('rounds up to the nearest value', function () {
            expect(gc.getIndexOfClosestValue(8, [1, 10, 20])).toEqual(1);
        });
    });
    describe('.formatId()', function () {
        it('coverts to lowercase', function () {
            expect(gc.formatId('FOO')).toEqual('foo');
        });
        it('replaces characters with diacritics to their ASCII counterparts', function () {
            expect(gc.formatId('ãàáäâẽèéëêìíïîõòóöôùúüûñç')).toEqual('aaaaaeeeeeiiiiooooouuuunc');
        });
        it('replaces whitespace with a dash', function () {
            expect(gc.formatId('foo bar')).toEqual('foo-bar');
        });
        it('replaces sequences of characters outside /a-z0-9\-_/ with a dash', function () {
            expect(gc.formatId('a±!@#$%^&*b')).toEqual('a-b');
        });
        it('replaces multiple dashes with a single dash', function () {
            expect(gc.formatId('a---b--c')).toEqual('a-b-c');
        });
        it('trims dashes from the beginning and end', function () {
            expect(gc.formatId('---a---')).toEqual('a');
        });
        it('strips characters outside a-z from the beginning of the string', function () {
             expect(gc.formatId('123!@#foo')).toEqual('foo');
        });
    });
});
ddescribe('.config()', function () {
    var configFactory;
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/page.html']));
    });
    configFactory = function (overwrite) {
        var config;
        config = $.extend({
            contents: $('#config .contents')[0]
        }, overwrite);
        return function () {
            return gc.config(config);
        };
    };
    it('throws an error if an unknown property is provided', function () {
        expect(configFactory({unknown: null}))
            .toThrowError('Unknown configuration property.');
    });
    describe('setting config.contents', function () {
        it('throws an error if it is not set', function () {
            expect(configFactory({contents: null}))
                .toThrowError('Option "contents" is not set.');
        });
        it('throws an error if it is not an HTMLElement object', function () {
            expect(configFactory({contents: {}}))
                .toThrowError('Option "contents" is not an HTMLElement object.');
        });
    });
    describe('setting config.articles', function () {
        it('throws an error if it is not a collection of HTMLElement objects.', function () {
            expect(configFactory({articles: {}}))
                .toThrowError('Option "articles" is not a collection of HTMLElement objects.');
        });
    });
    describe('setting config.link', function () {
        it('throws an error if it is not a function', function () {
            expect(configFactory({link: 'not a function'}))
                .toThrowError('Option "link" must be a function.');
        });
        it('defaults to gajus.contents.link', function () {
            expect(configFactory()().link).toEqual(gc.link);
        });
    });
});