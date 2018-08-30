import fs from 'fs';
import path from 'path';
import {
  JSDOM
} from 'jsdom';
import {
  expect
} from 'chai';
import Contents from '../src';

const createElement = (html) => {
  return (new JSDOM(html)).window.document.firstChild;
};

describe('contents', () => {
  beforeEach(() => {
    const page = fs.readFileSync(path.resolve(__dirname, 'fixtures/page.html'), 'utf8');

    const dom = new JSDOM(page);

    global.window = dom.window;
    global.document = dom.window.document;
  });

  describe('DOM dependent method', () => {
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
          const haystack = ['id-not-unique'];

          Contents.uniqueID('id-not-unique', haystack);

          expect(haystack).to.deep.equal(['id-not-unique', 'id-not-unique-1']);
        });
      });
    });
    describe('.level()', () => {
      it('derives level for heading element', () => {
        expect(Contents.level(createElement('<h1 />'))).to.equal(1);
      });
      describe('when element is not heading', () => {
        let element;

        beforeEach(() => {
          element = createElement('<foo />');
        });
        it('defaults to 1', () => {
          expect(Contents.level(element)).to.equal(1);
        });
        it('uses gajus.contents.level dataset property', () => {
          element.dataset['gajus.contents.level'] = 2;

          expect(Contents.level(element)).to.equal(2);
        });
      });
    });
    describe('.link()', () => {
      let article;
      let guide;

      beforeEach(() => {
        guide = document.createElement('div');
        article = {
          element: document.createElement('div'),
          id: 'foo',
          name: 'Foo'
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
    describe.skip('.indexOffset()', () => {
      let offsetIndex;

      beforeEach(() => {
        offsetIndex = Contents.indexOffset(document.querySelectorAll('#index_offset div'));
      });
      it('returns vertical offset of all elements', () => {
        expect(offsetIndex).to.deep.equal([0, 100, 200]);
      });
    });
    describe('.articles()', () => {
      const removeElementProperty = (tree) => {
        tree.forEach((node) => {
          Reflect.deleteProperty(node, 'element');
        });
      };

      it('represents a flat structure', () => {
        const articles = Contents.articles(document.querySelectorAll('#make_articles h1'));

        const expectedArticles = [
          {
            id: 'A1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'B1',
            level: 1,
            name: 'B1'
          },
          {
            id: 'C1',
            level: 1,
            name: 'C1'
          }
        ];

        removeElementProperty(articles);

        expect(articles).to.deep.equal(expectedArticles);
      });
    });
  });
  describe('DOM independent method', () => {
    describe('.tree()', () => {
      const removeElementProperty = (tree) => {
        tree.forEach((node) => {
          Reflect.deleteProperty(node, 'element');

          removeElementProperty(node.descendants);
        });
      };

      it('represents a flat structure', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 1,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 1,
            name: 'C1'
          }
        ];

        const tree = Contents.tree(articles);

        const expectedTree = [
          {
            descendants: [],
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            descendants: [],
            id: 'b1',
            level: 1,
            name: 'B1'
          },
          {
            descendants: [],
            id: 'c1',
            level: 1,
            name: 'C1'
          }
        ];

        removeElementProperty(tree);

        expect(tree).to.deep.equal(expectedTree);
      });
      it('represents an ascending hierarchy', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 3,
            name: 'C1'
          }
        ];

        const tree = Contents.tree(articles);

        const a1 = {
          descendants: [],
          id: 'a1',
          level: 1,
          name: 'A1'
        };
        const b1 = {
          descendants: [],
          id: 'b1',
          level: 2,
          name: 'B1'
        };
        const c1 = {
          descendants: [],
          id: 'c1',
          level: 3,
          name: 'C1'
        };

        a1.descendants = [b1];
        b1.descendants = [c1];

        const expectedTree = [a1];

        removeElementProperty(tree);

        expect(tree).to.deep.equal(expectedTree);
      });
      it('represents a multiple children', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'b2',
            level: 2,
            name: 'B2'
          }
        ];

        const tree = Contents.tree(articles);

        const a1 = {
          descendants: [],
          id: 'a1',
          level: 1,
          name: 'A1'
        };
        const b1 = {
          descendants: [],
          id: 'b1',
          level: 2,
          name: 'B1'
        };
        const b2 = {
          descendants: [],
          id: 'b2',
          level: 2,
          name: 'B2'
        };

        a1.descendants = [b1, b2];

        const expectedTree = [a1];

        removeElementProperty(tree);

        expect(tree).to.deep.equal(expectedTree);
      });
      it('represents a descending hierarchy', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 3,
            name: 'C1'
          },
          {
            id: 'b2',
            level: 2,
            name: 'B2'
          },
          {
            id: 'a2',
            level: 1,
            name: 'A2'
          }
        ];

        const tree = Contents.tree(articles);

        const a1 = {
          descendants: [],
          id: 'a1',
          level: 1,
          name: 'A1'
        };
        const b1 = {
          descendants: [],
          id: 'b1',
          level: 2,
          name: 'B1'
        };
        const c1 = {
          descendants: [],
          id: 'c1',
          level: 3,
          name: 'C1'
        };
        const b2 = {
          descendants: [],
          id: 'b2',
          level: 2,
          name: 'B2'
        };
        const a2 = {
          descendants: [],
          id: 'a2',
          level: 1,
          name: 'A2'
        };

        a1.descendants = [b1, b2];
        b1.descendants = [c1];

        const expectedTree = [a1, a2];

        removeElementProperty(tree);

        expect(tree).to.deep.equal(expectedTree);
      });
      it('represents a descending hierarchy with gaps', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 3,
            name: 'C1'
          },
          {
            id: 'a2',
            level: 1,
            name: 'A2'
          }
        ];

        const tree = Contents.tree(articles);

        const a1 = {
          descendants: [],
          id: 'a1',
          level: 1,
          name: 'A1'
        };
        const b1 = {
          descendants: [],
          id: 'b1',
          level: 2,
          name: 'B1'
        };
        const c1 = {
          descendants: [],
          id: 'c1',
          level: 3,
          name: 'C1'
        };
        const a2 = {
          descendants: [],
          id: 'a2',
          level: 1,
          name: 'A2'
        };

        a1.descendants = [b1];
        b1.descendants = [c1];

        const expectedTree = [a1, a2];

        removeElementProperty(tree);

        expect(tree).to.deep.equal(expectedTree);
      });
    });
    describe('.list()', () => {
      it('represents a flat structure', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 1,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 1,
            name: 'C1'
          }
        ];

        const tree = Contents.tree(articles);
        const list = Contents.list(tree, (listElement, article) => {
          listElement.innerHTML = article.name;
        });

        expect(list.outerHTML).to.equal('<ol><li>A1</li><li>B1</li><li>C1</li></ol>');
      });
      it('represents an ascending hierarchy', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 3,
            name: 'C1'
          }
        ];

        const tree = Contents.tree(articles);
        const list = Contents.list(tree, (listElement, article) => {
          listElement.innerHTML = article.name;
        });

        expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li></ol></li></ol>');
      });
      it('represents a multiple children', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'b2',
            level: 2,
            name: 'B2'
          }
        ];

        const tree = Contents.tree(articles);
        const list = Contents.list(tree, (listElement, article) => {
          listElement.innerHTML = article.name;
        });

        expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1</li><li>B2</li></ol></li></ol>');
      });
      it('represents a descending hierarchy', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 3,
            name: 'C1'
          },
          {
            id: 'b2',
            level: 2,
            name: 'B2'
          },
          {
            id: 'a2',
            level: 1,
            name: 'A2'
          }
        ];

        const tree = Contents.tree(articles);

        const list = Contents.list(tree, (listElement, article) => {
          listElement.innerHTML = article.name;
        });

        expect(list.outerHTML).to.equal('<ol><li>A1<ol><li>B1<ol><li>C1</li></ol></li><li>B2</li></ol></li><li>A2</li></ol>');
      });
      it('represents a descending hierarchy with gaps', () => {
        const articles = [
          {
            id: 'a1',
            level: 1,
            name: 'A1'
          },
          {
            id: 'b1',
            level: 2,
            name: 'B1'
          },
          {
            id: 'c1',
            level: 3,
            name: 'C1'
          },
          {
            id: 'a2',
            level: 1,
            name: 'A2'
          }
        ];

        const tree = Contents.tree(articles);

        const list = Contents.list(tree, (listElement, article) => {
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
      it('replaces sequences of characters outside /a-z0-9-_/ with a dash', () => {
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
    const configFactory = (overwrite) => {
      const config = {
        ...overwrite
      };

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
});
