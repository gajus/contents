var Contents = gajus.Contents;
describe('contents', function () {
    var contents;
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/page.html']));

        contents = Contents({
            articles: document.querySelectorAll('#constructor h1')
        });
    });
    it('produces an instance of Contents', function () {
        expect(contents instanceof Contents).toBe(true);
    });
    describe('.list()', function () {
        it('produces a HTMLElement', function () {
            expect(contents.list() instanceof HTMLElement).toBe(true);
        });
    });
    describe('.eventEmitter()', function () {
        it('produces an event emitter', function () {
            expect(contents.eventEmitter().constructor.name).toBe('Sister');
        });
    });
});
describe('DOM dependent method', function () {
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/page.html']));
    });
    describe('.id()', function () {
        it('uses the formatId function', function () {
            expect(Contents.id('', function () { return 'ok'; })).toEqual('ok');
        });
        it('throws an error if formattedId is invalid', function () {
            expect(function () {
                expect(Contents.id('', function () { return '-ok'; }));
            }).toThrowError('Invalid ID (-ok).');
        });
        it('derives a unique ID', function () {
            expect(Contents.id('id-not-unique')).toEqual('id-not-unique-1');
        });
    });
    describe('.level()', function () {
        it('derives level for heading element', function () {
            expect(Contents.level($('<h1>')[0])).toEqual(1);
        });
        describe('when element is not heading', function () {
            var element;
            beforeEach(function () {
                element = $('<foo>');
            });
            it('defaults to 1', function () {
                expect(Contents.level(element[0])).toEqual(1);
            });
            it('uses gajus.contents.level dataset property', function () {
                element[0].dataset['gajus.contents.level'] = 2;

                expect(Contents.level(element[0])).toEqual(2);
            });
            it('uses jQuery gajus.contents.level dataset property', function () {
                element.data('gajus.contents.level', 3);

                expect(Contents.level(element[0])).toEqual(3);
            });
        });
    });
    describe('.link()', function () {
        var guide,
            article;
        beforeEach(function () {
            guide = $('#link .guide');
            article = $('#link .article');
            Contents.link(guide[0], article[0]);
        });
        it('uses existing article id', function () {
            guide = $('#link .guide');
            article = $('#link-bar');
            Contents.link(guide[0], article[0]);
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
            offsetIndex = Contents.indexOffset(document.querySelectorAll('#index_offset div'));
        });
        it('returns vertical offset of all elements', function () {
            expect(offsetIndex).toEqual([0, 100, 200]);
        });
    });
    describe('.makeList()', function () {
        it('represents a flat structure', function () {
            var list = Contents.makeList(document.querySelectorAll('#make_list-flat p'), function () {});

            expect(list.outerHTML).toEqual('<ol><li></li><li></li><li></li></ol>');
        });
        it('represents an increasing hierarchy', function () {
            var list = Contents.makeList($('#make_list-increasing_hierarchy').find('h1, h2, h3').get(), function () {});

            expect(list.outerHTML).toEqual('<ol><li><ol><li><ol><li></li></ol></li></ol></li></ol>');
        });
        it('represents a decreasing hierarchy', function () {
            var list = Contents.makeList($('#make_list-decreasing_hierarchy').find('h1, h2, h3').get(), function () {});

            expect(list.outerHTML).toEqual('<ol><li><ol><li><ol><li></li></ol></li><li></li></ol></li></ol>');
        });
    });
});
describe('DOM independent method', function () {
    describe('.getIndexOfClosestValue()', function () {
        it('throws an error when the haystack is empty', function () {
            expect(function () {
                Contents.getIndexOfClosestValue(1, []);
            }).toThrowError('Haystack must be not empty.');
        });
        it('returns index of the first value when haystack length is 1', function () {
            expect(Contents.getIndexOfClosestValue(1, [100])).toEqual(0);
        });
        it('rounds down to the nearest value', function () {
            expect(Contents.getIndexOfClosestValue(12, [1, 10, 20])).toEqual(1);
        });
        it('returns index of the exact value', function () {
            expect(Contents.getIndexOfClosestValue(10, [1, 10, 20])).toEqual(1);
        });
        it('rounds up to the nearest value', function () {
            expect(Contents.getIndexOfClosestValue(8, [1, 10, 20])).toEqual(1);
        });
    });
    describe('.formatId()', function () {
        it('coverts to lowercase', function () {
            expect(Contents.formatId('FOO')).toEqual('foo');
        });
        it('replaces characters with diacritics to their ASCII counterparts', function () {
            expect(Contents.formatId('ãàáäâẽèéëêìíïîõòóöôùúüûñç')).toEqual('aaaaaeeeeeiiiiooooouuuunc');
        });
        it('replaces whitespace with a dash', function () {
            expect(Contents.formatId('foo bar')).toEqual('foo-bar');
        });
        it('replaces sequences of characters outside /a-z0-9\-_/ with a dash', function () {
            expect(Contents.formatId('a±!@#$%^&*b')).toEqual('a-b');
        });
        it('replaces multiple dashes with a single dash', function () {
            expect(Contents.formatId('a---b--c')).toEqual('a-b-c');
        });
        it('trims dashes from the beginning and end', function () {
            expect(Contents.formatId('---a---')).toEqual('a');
        });
        it('strips characters outside a-z from the beginning of the string', function () {
             expect(Contents.formatId('123!@#foo')).toEqual('foo');
        });
    });
});
describe('.config()', function () {
    var configFactory;
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/page.html']));
    });
    configFactory = function (overwrite) {
        var config;
        config = $.extend({}, overwrite);
        return function () {
            return Contents.config(config);
        };
    };
    it('throws an error if an unknown property is provided', function () {
        expect(configFactory({unknown: null}))
            .toThrowError('Unknown configuration property.');
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
        it('defaults to Contents.link', function () {
            expect(configFactory()().link).toEqual(Contents.link);
        });
    });
});