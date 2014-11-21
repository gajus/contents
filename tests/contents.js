var Contents = gajus.Contents;
describe('contents', function () {
    var contents;
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['tests/fixture/page.html']));

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
        it('defines .on()', function () {
            expect(contents.eventEmitter().on).toBeDefined();
        });
        it('defines .trigger()', function () {
            expect(contents.eventEmitter().trigger).toBeDefined();
        });
    });
});
describe('DOM dependent method', function () {
    beforeEach(function () {
        $('body').html($.parseHTML(__html__['tests/fixture/page.html']));
    });
    describe('.uniqueID()', function () {
        it('derives a unique ID in the context of the document', function () {
            expect(Contents.uniqueID('id-not-unique')).toEqual('id-not-unique-1');
        });
        it('derives a unique ID in the context of array', function () {
            expect(Contents.uniqueID('id-not-unique', ['id-not-unique'])).toEqual('id-not-unique-1');
        });
        it('updates the haystack when using array context', function () {
            var haystack = ['id-not-unique'];
            Contents.uniqueID('id-not-unique', haystack);
            expect(haystack).toEqual(['id-not-unique', 'id-not-unique-1']);
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
            guide = document.createElement('div');
            article = {
                id: 'foo',
                name: 'Foo',
                element: document.createElement('div')
            };
            Contents.link(guide, article);
        });
        it('gives article an id', function () {
            expect(article.id).toEqual('foo');
        });
        it('wraps article content in a hyperlink', function () {
            expect(article.element.innerHTML).toEqual('<a href="#foo"></a>');
        });
        it('appends a hyperlink to the guide', function () {
            expect(guide.innerHTML).toEqual('<a href="#foo">Foo</a>');
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
    describe('.articles()', function () {
        var removeElementProperty = function (tree) {
            tree.forEach(function (node) {
                delete node.element;
            });
        };
        it('represents a flat structure', function () {
            var articles = Contents.articles(document.querySelectorAll('#make_articles h1')),
                expectedArticles;

            expectedArticles = [
                {level: 1, id: 'A1', name: 'A1'},
                {level: 1, id: 'B1', name: 'B1'},
                {level: 1, id: 'C1', name: 'C1'}
            ];

            removeElementProperty(articles);

            expect(articles).toEqual(expectedArticles);
        });
    });
});
describe('DOM independent method', function () {
    describe('.tree()', function () {
        var removeElementProperty = function (tree) {
            tree.forEach(function (node) {
                delete node.element;

                removeElementProperty(node.descendants);
            });
        };
        it('represents a flat structure', function () {
            var articles,
                tree,
                expectedTree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 1, id: 'b1', name: 'B1'},
                {level: 1, id: 'c1', name: 'C1'}
            ];

            tree = Contents.tree(articles);

            expectedTree = [
                {level: 1, id: 'a1', name: 'A1', descendants: []},
                {level: 1, id: 'b1', name: 'B1', descendants: []},
                {level: 1, id: 'c1', name: 'C1', descendants: []}
            ];

            removeElementProperty(tree);

            expect(tree).toEqual(expectedTree);
        });
        it('represents an ascending hierarchy', function () {
            var articles,
                tree,
                expectedTree,
                a1,
                b1,
                c1;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'}
            ];

            tree = Contents.tree(articles);

            a1 = {level: 1, id: 'a1', name: 'A1', descendants: []};
            b1 = {level: 2, id: 'b1', name: 'B1', descendants: []};
            c1 = {level: 3, id: 'c1', name: 'C1', descendants: []};

            a1.descendants = [b1];
            b1.descendants = [c1];

            expectedTree = [a1];

            removeElementProperty(tree);

            expect(tree).toEqual(expectedTree);
        });
        it('represents a multiple children', function () {
            var articles,
                tree,
                expectedTree,
                a1,
                b1,
                b2;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 2, id: 'b2', name: 'B2'}
            ];

            tree = Contents.tree(articles);

            a1 = {level: 1, id: 'a1', name: 'A1', descendants: []};
            b1 = {level: 2, id: 'b1', name: 'B1', descendants: []};
            b2 = {level: 2, id: 'b2', name: 'B2', descendants: []};

            a1.descendants = [b1, b2];

            expectedTree = [a1];

            removeElementProperty(tree);

            expect(tree).toEqual(expectedTree);
        });
        it('represents a descending hierarchy', function () {
            var articles,
                tree,
                expectedTree,
                a1,
                b1,
                c1,
                b2,
                a2;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'},
                {level: 2, id: 'b2', name: 'B2'},
                {level: 1, id: 'a2', name: 'A2'}
            ];

            tree = Contents.tree(articles);

            a1 = {level: 1, id: 'a1', name: 'A1', descendants: []};
            b1 = {level: 2, id: 'b1', name: 'B1', descendants: []};
            c1 = {level: 3, id: 'c1', name: 'C1', descendants: []};
            b2 = {level: 2, id: 'b2', name: 'B2', descendants: []};
            a2 = {level: 1, id: 'a2', name: 'A2', descendants: []};

            a1.descendants = [b1, b2];
            b1.descendants = [c1];

            expectedTree = [a1, a2];

            removeElementProperty(tree);

            expect(tree).toEqual(expectedTree);
        });
        it('represents a descending hierarchy with gaps', function () {
            var articles,
                tree,
                expectedTree,
                a1,
                b1,
                c1,
                b2,
                a2;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'},
                {level: 1, id: 'a2', name: 'A2'}
            ];

            tree = Contents.tree(articles);

            a1 = {level: 1, id: 'a1', name: 'A1', descendants: []};
            b1 = {level: 2, id: 'b1', name: 'B1', descendants: []};
            c1 = {level: 3, id: 'c1', name: 'C1', descendants: []};
            a2 = {level: 1, id: 'a2', name: 'A2', descendants: []};

            a1.descendants = [b1];
            b1.descendants = [c1];

            expectedTree = [a1, a2];

            removeElementProperty(tree);

            expect(tree).toEqual(expectedTree);
        });
    });
    describe('.list()', function () {
        it('represents a flat structure', function () {
            var articles,
                tree,
                list;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 1, id: 'b1', name: 'B1'},
                {level: 1, id: 'c1', name: 'C1'}
            ];

            tree = Contents.tree(articles);
            list = Contents.list(tree, function (listElement, article) {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).toEqual('<ol><li>A1</li><li>B1</li><li>C1</li></ol>');
        });
        it('represents an ascending hierarchy', function () {
            var articles,
                tree,
                list;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'}
            ];

            tree = Contents.tree(articles);
            list = Contents.list(tree, function (listElement, article) {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).toEqual('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li></ol></li></ol>');
        });
        it('represents a multiple children', function () {
            var articles,
                tree,
                list;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 2, id: 'b2', name: 'B2'}
            ];

            tree = Contents.tree(articles);
            list = Contents.list(tree, function (listElement, article) {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).toEqual('<ol><li>A1<ol><li>B1</li><li>B2</li></ol></li></ol>');
        });
        it('represents a descending hierarchy', function () {
            var articles,
                tree,
                list;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'},
                {level: 2, id: 'b2', name: 'B2'},
                {level: 1, id: 'a2', name: 'A2'}
            ];

            tree = Contents.tree(articles);

            list = Contents.list(tree, function (listElement, article) {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).toEqual('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li><li>B2</li></ol></li><li>A2</li></ol>');
        });
        it('represents a descending hierarchy with gaps', function () {
            var articles,
                tree,
                expectedTree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'},
                {level: 1, id: 'a2', name: 'A2'}
            ];

            tree = Contents.tree(articles);

            list = Contents.list(tree, function (listElement, article) {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).toEqual('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li></ol></li><li>A2</li></ol>');
        });
    });
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
    describe('setting config.articleId', function () {
        it('throws an error if it is not a function', function () {
            expect(configFactory({articleId: 'not a function'}))
                .toThrowError('Option "articleId" must be a function.');
        });
        it('defaults to Contents.articleId', function () {
            expect(configFactory()().articleId).toEqual(Contents.articleId);
        });
    });
    describe('setting config.articleName', function () {
        it('throws an error if it is not a function', function () {
            expect(configFactory({articleName: 'not a function'}))
                .toThrowError('Option "articleName" must be a function.');
        });
        it('defaults to Contents.link', function () {
            expect(configFactory()().articleName).toEqual(Contents.articleName);
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