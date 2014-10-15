var gc = gajus.contents;

describe('DOM dependent method', function () {
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/page.html']));
    });
    describe('.id()', function () {
        it('must use the formatId function', function () {
            expect(gc.id('', function () { return 'ok'; })).toEqual('ok');
        });
        it('must throw an error if formattedId is invalid', function () {
            expect(function () {
                expect(gc.id('', function () { return '-ok'; }));
            }).toThrowError('Invalid ID.');
        });
        it('must derive a unique ID', function () {
            expect(gc.id('id-not-unique')).toEqual('id-not-unique-1');
        });
    });
    describe('.level()', function () {
        it('must derive level for heading element', function () {
            expect(gc.level($('<h1>'))).toEqual(1);
        });
        describe('when element is not heading', function () {
            it('must use gajus.contents.level data attribute', function () {
                expect(gc.level($('<foo>').data('gajus.contents.level', 2))).toEqual(2);
            });
            it('must default to 1', function () {
                expect(gc.level($('<foo>'))).toEqual(1);
            });
        });
    });
    describe('.link()', function () {
        var guide,
            article;
        beforeEach(function () {
            guide = $('#link .guide');
            article = $('#link .article');
            gc.link(guide, article);
        });
        it('must give article an id', function () {
            expect(article.attr('id')).toEqual('foo');
        });
        it('must wrap article content in a hyperlink', function () {
            expect(article.html()).toEqual('<a href="#foo">foo</a>');
        });
        it('must append a hyperlink to the guide', function () {
            expect(guide.html()).toEqual('<a href="#foo">foo</a>');
        });
    });
    describe('.indexOffset()', function () {
        var offsetIndex;
        beforeEach(function () {
            offsetIndex = gc.indexOffset($('#index_offset div'));
        });
        it('must return vertical offset of all elements', function () {
            expect(offsetIndex).toEqual([0, 100, 200]);
        });
    });
    describe('.makeList()', function () {
        it('must represent a flat structure', function () {
            var list = gc.makeList($('#make_list-flat p'), function () {});

            expect(list.prop('outerHTML')).toEqual('<ol><li></li><li></li><li></li></ol>');
        });
        it('must represent an increasing hierarchy', function () {
            var list = gc.makeList($('#make_list-increasing_hierarchy').find('h1, h2, h3'), function () {});

            expect(list.prop('outerHTML')).toEqual('<ol><li><ol><li><ol><li></li></ol></li></ol></li></ol>');
        });
        it('must represent a decreasing hierarchy', function () {
            var list = gc.makeList($('#make_list-decreasing_hierarchy').find('h1, h2, h3'), function () {});

            expect(list.prop('outerHTML')).toEqual('<ol><li><ol><li><ol><li></li></ol></li><li></li></ol></li></ol>');
        });
    });
});

describe('DOM independent method', function () {
    describe('.getIndexOfClosestValue()', function () {
        it('must throw an error when the haystack is empty', function () {
            expect(function () {
                gc.getIndexOfClosestValue(1, []);
            }).toThrowError('Haystack must be not empty.');
        });
        it('must return index of the first value when haystack length is 1', function () {
            expect(gc.getIndexOfClosestValue(1, [100])).toEqual(0);
        });
        it('must round down to the nearest value', function () {
            expect(gc.getIndexOfClosestValue(12, [1, 10, 20])).toEqual(1);
        });
        it('must return index of the exact value', function () {
            expect(gc.getIndexOfClosestValue(10, [1, 10, 20])).toEqual(1);
        });
        it('must round up to the nearest value', function () {
            expect(gc.getIndexOfClosestValue(8, [1, 10, 20])).toEqual(1);
        });
    });
    describe('.formatId()', function () {
        it('must covert to lowercase', function () {
            expect(gc.formatId('FOO')).toEqual('foo');
        });

        it('must replace characters with diacritics to their ASCII counterparts', function () {
            expect(gc.formatId('ãàáäâẽèéëêìíïîõòóöôùúüûñç')).toEqual('aaaaaeeeeeiiiiooooouuuunc');
        });

        it('must replace whitespace with a dash', function () {
            expect(gc.formatId('foo bar')).toEqual('foo-bar');
        });

        it('must replace sequences of characters outside /a-z0-9\-_/ with a dash', function () {
            expect(gc.formatId('a±!@#$%^&*b')).toEqual('a-b');
        });

        it('must replace multiple dashes with a single dash', function () {
            expect(gc.formatId('a---b--c')).toEqual('a-b-c');
        });

        it('must trim dashes from the beginning and end', function () {
            expect(gc.formatId('---a---')).toEqual('a');
        });

        it('must strip characters outside a-z from the beginning of the string', function () {
             expect(gc.formatId('123!@#foo')).toEqual('foo');
        });
    });
});

describe('.config()', function () {
    var configFactory;

    configFactory = function (overwrite) {
        var config;

        config = $.extend({
            contents: $('#config .contents')
        }, overwrite);

        return function () {
            return gc.config(config);
        };
    };

    it('must throw an error if an unknown property is provided', function () {
        expect(configFactory({unknown: null}))
            .toThrowError('Unknown configuration property.');
    });

    describe('setting config.contents', function () {
        it('must throw an error if it is not set', function () {
            expect(configFactory({contents: null}))
                .toThrowError('Option "contents" is not set.');
        });
        it('must throw an error if it is not a jQuery object', function () {
            expect(configFactory({contents: {}}))
                .toThrowError('Option "contents" is not a jQuery object.');
        });
    });
    describe('setting config.articles', function () {
        it('must throw an error if it is not a jQuery object', function () {
            expect(configFactory({articles: {}}))
                .toThrowError('Option "articles" is not a jQuery object.');
        });
    });
    describe('setting config.link', function () {
        it('must throw an error if it is not a function', function () {
            expect(configFactory({link: 'not a function'}))
                .toThrowError('Option "link" must be a function.');
        });
        it('must default to gajus.contents.link', function () {
            expect(configFactory()().link).toEqual(gc.link);
        });
    });
});