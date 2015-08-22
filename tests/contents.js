let Contents;

Contents = gajus.Contents;

describe('contents', () => {
    let contents;

    beforeEach(() => {
        $('body').html($.parseHTML(__html__['tests/fixture/page.html']));

        contents = Contents({
            articles: document.querySelectorAll('#constructor h1')
        });
    });

    describe('.list()', () => {
        it('produces a HTMLElement', () => {
            expect(contents.list() instanceof HTMLElement).to.equal(true);
        });
    });
    describe('.eventEmitter()', () => {
        it('defines .on()', () => {
            expect(contents.eventEmitter().on).to.not.be.an('undefined');
        });
        it('defines .trigger()', () => {
            expect(contents.eventEmitter().trigger).to.not.be.an('undefined');
        });
    });
});
describe('DOM dependent method', () => {
    beforeEach(() => {
        $('body').html($.parseHTML(__html__['tests/fixture/page.html']));
    });
    describe('.uniqueID()', () => {
        describe('when in the context of the document', () => {
            it('does not affect a unique ID', () => {
                expect(Contents.uniqueID('id-unique')).to.equal('id-unique');
            });
            it('derives a unique ID', () => {
                expect(Contents.uniqueID('id-not-unique')).to.equal('id-not-unique-1');
            });
        });
        describe('when in the context of an array', () => {
            it('does not affect a unique ID', () => {
                expect(Contents.uniqueID('id-unique', [])).to.equal('id-unique');
            });
            it('derives a unique ID', () => {
                expect(Contents.uniqueID('id-not-unique', ['id-not-unique'])).to.equal('id-not-unique-1');
            });
            it('updates the haystack', () => {
                let haystack;

                haystack = ['id-not-unique'];
                Contents.uniqueID('id-not-unique', haystack);
                expect(haystack).to.deep.equal(['id-not-unique', 'id-not-unique-1']);
            });
        });
    });
    describe('.level()', () => {
        it('derives level for heading element', () => {
            expect(Contents.level($('<h1>')[0])).to.equal(1);
        });
        describe('when element is not heading', () => {
            let element;

            beforeEach(() => {
                element = $('<foo>');
            });
            it('defaults to 1', () => {
                expect(Contents.level(element[0])).to.equal(1);
            });
            it('uses gajus.contents.level dataset property', () => {
                element[0].dataset['gajus.contents.level'] = 2;

                expect(Contents.level(element[0])).to.equal(2);
            });
            it('uses jQuery gajus.contents.level dataset property', () => {
                element.data('gajus.contents.level', 3);

                expect(Contents.level(element[0])).to.equal(3);
            });
        });
    });
    describe('.link()', () => {
        let article,
            guide;

        beforeEach(() => {
            guide = document.createElement('div');
            article = {
                id: 'foo',
                name: 'Foo',
                element: document.createElement('div')
            };
            Contents.link(guide, article);
        });
        it('gives article an id', () => {
            expect(article.id).to.equal('foo');
        });
        it('wraps article content in a hyperlink', () => {
            expect(article.element.innerHTML).to.equal('<a href="#foo"></a>');
        });
        it('appends a hyperlink to the guide', () => {
            expect(guide.innerHTML).to.equal('<a href="#foo">Foo</a>');
        });
    });
    describe('.indexOffset()', () => {
        let offsetIndex;

        beforeEach(() => {
            offsetIndex = Contents.indexOffset(document.querySelectorAll('#index_offset div'));
        });
        it('returns vertical offset of all elements', () => {
            expect(offsetIndex).to.deep.equal([0, 100, 200]);
        });
    });
    describe('.articles()', () => {
        let removeElementProperty;

        removeElementProperty = tree => {
            tree.forEach(node => {
                Reflect.deleteProperty(node, 'element');
            });
        };
        it('represents a flat structure', () => {
            let articles,
                expectedArticles;

            articles = Contents.articles(document.querySelectorAll('#make_articles h1'));

            expectedArticles = [
                {level: 1, id: 'A1', name: 'A1'},
                {level: 1, id: 'B1', name: 'B1'},
                {level: 1, id: 'C1', name: 'C1'}
            ];

            removeElementProperty(articles);

            expect(articles).to.deep.equal(expectedArticles);
        });
    });
});
describe('DOM independent method', () => {
    describe('.tree()', () => {
        let removeElementProperty;

        removeElementProperty = tree => {
            tree.forEach(node => {
                Reflect.deleteProperty(node, 'element');

                removeElementProperty(node.descendants);
            });
        };
        it('represents a flat structure', () => {
            let articles,
                expectedTree,
                tree;

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

            expect(tree).to.deep.equal(expectedTree);
        });
        it('represents an ascending hierarchy', () => {
            let a1,
                articles,
                b1,
                c1,
                expectedTree,
                tree;

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

            expect(tree).to.deep.equal(expectedTree);
        });
        it('represents a multiple children', () => {
            let a1,
                articles,
                b1,
                b2,
                expectedTree,
                tree;

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

            expect(tree).to.deep.equal(expectedTree);
        });
        it('represents a descending hierarchy', () => {
            let a1,
                a2,
                articles,
                b1,
                b2,
                c1,
                expectedTree,
                tree;

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

            expect(tree).to.deep.equal(expectedTree);
        });
        it('represents a descending hierarchy with gaps', () => {
            let a1,
                a2,
                articles,
                b1,
                c1,
                expectedTree,
                tree;

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

            expect(tree).to.deep.equal(expectedTree);
        });
    });
    describe('.list()', () => {
        it('represents a flat structure', () => {
            let articles,
                list,
                tree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 1, id: 'b1', name: 'B1'},
                {level: 1, id: 'c1', name: 'C1'}
            ];

            tree = Contents.tree(articles);
            list = Contents.list(tree, (listElement, article) => {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).to.equal('<ol><li>A1</li><li>B1</li><li>C1</li></ol>');
        });
        it('represents an ascending hierarchy', () => {
            let articles,
                list,
                tree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'}
            ];

            tree = Contents.tree(articles);
            list = Contents.list(tree, (listElement, article) => {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li></ol></li></ol>');
        });
        it('represents a multiple children', () => {
            let articles,
                list,
                tree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 2, id: 'b2', name: 'B2'}
            ];

            tree = Contents.tree(articles);
            list = Contents.list(tree, (listElement, article) => {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1</li><li>B2</li></ol></li></ol>');
        });
        it('represents a descending hierarchy', () => {
            let articles,
                list,
                tree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'},
                {level: 2, id: 'b2', name: 'B2'},
                {level: 1, id: 'a2', name: 'A2'}
            ];

            tree = Contents.tree(articles);

            list = Contents.list(tree, (listElement, article) => {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li><li>B2</li></ol></li><li>A2</li></ol>');
        });
        it('represents a descending hierarchy with gaps', () => {
            let articles,
                list,
                tree;

            articles = [
                {level: 1, id: 'a1', name: 'A1'},
                {level: 2, id: 'b1', name: 'B1'},
                {level: 3, id: 'c1', name: 'C1'},
                {level: 1, id: 'a2', name: 'A2'}
            ];

            tree = Contents.tree(articles);

            list = Contents.list(tree, (listElement, article) => {
                listElement.innerHTML = article.name;
            });

            expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li></ol></li><li>A2</li></ol>');
        });
    });
    describe('.getIndexOfClosestValue()', () => {
        it('throws an error when the haystack is empty', () => {
            expect(() => {
                Contents.getIndexOfClosestValue(1, []);
            }).to.throw(Error, 'Haystack must be not empty.');
        });
        it('returns index of the first value when haystack length is 1', () => {
            expect(Contents.getIndexOfClosestValue(1, [100])).to.equal(0);
        });
        it('rounds down to the nearest value', () => {
            expect(Contents.getIndexOfClosestValue(12, [1, 10, 20])).to.equal(1);
        });
        it('returns index of the exact value', () => {
            expect(Contents.getIndexOfClosestValue(10, [1, 10, 20])).to.equal(1);
        });
        it('rounds up to the nearest value', () => {
            expect(Contents.getIndexOfClosestValue(8, [1, 10, 20])).to.equal(1);
        });
    });
    describe('.formatId()', () => {
        it('coverts to lowercase', () => {
            expect(Contents.formatId('FOO')).to.equal('foo');
        });
        it('replaces characters with diacritics to their ASCII counterparts', () => {
            expect(Contents.formatId('ãàáäâẽèéëêìíïîõòóöôùúüûñç')).to.equal('aaaaaeeeeeiiiiooooouuuunc');
        });
        it('replaces whitespace with a dash', () => {
            expect(Contents.formatId('foo bar')).to.equal('foo-bar');
        });
        it('replaces sequences of characters outside /a-z0-9\-_/ with a dash', () => {
            expect(Contents.formatId('a±!@#$%^&*b')).to.equal('a-b');
        });
        it('replaces multiple dashes with a single dash', () => {
            expect(Contents.formatId('a---b--c')).to.equal('a-b-c');
        });
        it('trims dashes from the beginning and end', () => {
            expect(Contents.formatId('---a---')).to.equal('a');
        });
        it('strips characters outside a-z from the beginning of the string', () => {
            expect(Contents.formatId('123!@#foo')).to.equal('foo');
        });
    });
});
describe('.config()', () => {
    let configFactory;

    beforeEach(() => {
        $('body').html($.parseHTML(__html__['tests/fixture/page.html']));
    });
    configFactory = overwrite => {
        let config;

        config = $.extend({}, overwrite);
        return () => {
            return Contents.config(config);
        };
    };
    it('throws an error if an unknown property is provided', () => {
        expect(configFactory({unknown: null})).to.throw(Error, 'Unknown configuration property "unknown".');
    });
    describe('setting config.articles', () => {
        it('throws an error if it is not a collection of HTMLElement objects.', () => {
            expect(configFactory({articles: {}})).to.throw(Error, 'Option "articles" is not a collection of HTMLElement objects.');
        });
    });
    describe('setting config.articleId', () => {
        it('throws an error if it is not a function', () => {
            expect(configFactory({articleId: 'not a function'})).to.throw(Error, 'Option "articleId" must be a function.');
        });
        it('defaults to Contents.articleId', () => {
            expect(configFactory()().articleId).to.equal(Contents.articleId);
        });
    });
    describe('setting config.articleName', () => {
        it('throws an error if it is not a function', () => {
            expect(configFactory({articleName: 'not a function'})).to.throw(Error, 'Option "articleName" must be a function.');
        });
        it('defaults to Contents.link', () => {
            expect(configFactory()().articleName).to.equal(Contents.articleName);
        });
    });
    describe('setting config.link', () => {
        it('throws an error if it is not a function', () => {
            expect(configFactory({link: 'not a function'})).to.throw(Error, 'Option "link" must be a function.');
        });
        it('defaults to Contents.link', () => {
            expect(configFactory()().link).to.equal(Contents.link);
        });
    });
});
