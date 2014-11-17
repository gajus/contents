/**
 * @version 3.0.0
 * @link https://github.com/gajus/contents for the canonical source repository
 * @license https://github.com/gajus/contents/blob/master/LICENSE BSD 3-Clause
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
* @link https://github.com/gajus/sister for the canonical source repository
* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
*/
function Sister () {
    var sister = {},
        events = {};

    /**
     * @name handler
     * @function
     * @param {Object} data Event data.
     */

    /**
     * @param {String} name Event name.
     * @param {handler} handler
     * @return {listener}
     */
    sister.on = function (name, handler) {
        var listener = {name: name, handler: handler};
        events[name] = events[name] || [];
        events[name].unshift(listener);
        return listener;
    };

    /**
     * @param {listener}
     */
    sister.off = function (listener) {
        var index = events[listener.name].indexOf(listener);

        if (index != -1) {
            events[listener.name].splice(index, 1);
        }
    };

    /**
     * @param {String} name Event name.
     * @param {Object} data Event data.
     */
    sister.trigger = function (name, data) {
        var listeners = events[name],
            i;

        if (listeners) {
            i = listeners.length;
            while (i--) {
                listeners[i].handler(data);
            }
        }
    };

    return sister;
}

global.gajus = global.gajus || {};
global.gajus.Sister = Sister;

module.exports = Sister;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
var Sister = require('sister'),
    Contents;

/**
 * @param {object} config
 * @return {Contents}
 */
Contents = function Contents (config) {
    var contents,
        list,
        eventEmitter;

    if (!(this instanceof Contents)) {
        return new Contents(config);
    }

    contents = this;

    config = Contents.config(config);

    list = Contents.makeList(config.articles);

    Contents.forEach(list.querySelectorAll('li'), function (guide, i) {
        config.link(guide, config.articles[i]);
    });

    eventEmitter = Contents.bind(list, config);

    /**
     * @return {HTMLElement} Ordered list element representation of the table of contents.
     */
    contents.list = function () {
        return list;
    };

    /**
     * @return {Sister} Event emitter used to attach event listeners and trigger events.
     */
    contents.eventEmitter = function () {
        return eventEmitter;
    };
};

/**
 * @param {HTMLElement} Table of contents root element (<ol>).
 * @param {object} config Result of contents.config.
 * @return {object} Result of contents.eventEmitter.
 */
Contents.bind = function (list, config) {
    var emitter = Sister(),
        windowHeight,
        /**
         * @var {Array}
         */
        articleOffsetIndex,
        lastArticleIndex,
        guides = list.querySelectorAll('li');

    emitter.on('resize', function () {
        windowHeight = Contents.windowHeight();
        articleOffsetIndex = Contents.indexOffset(config.articles);

        emitter.trigger('scroll');
    });

    emitter.on('scroll', function () {
        var articleIndex,
            changeEvent;

        articleIndex = Contents.getIndexOfClosestValue(Contents.windowScrollY() + windowHeight * 0.2, articleOffsetIndex);

        if (articleIndex !== lastArticleIndex) {
            changeEvent = {};

            changeEvent.current = {
                article: config.articles[articleIndex],
                guide: guides[articleIndex]
            };

            if (lastArticleIndex !== undefined) {
                changeEvent.previous = {
                    article: config.articles[lastArticleIndex],
                    guide: guides[lastArticleIndex]
                };
            }

            emitter.trigger('change', changeEvent);

            lastArticleIndex = articleIndex;
        }
    });

    // This allows the script that constructs Contents
    // to catch the first ready, resize and scroll events.
    setTimeout(function () {
        emitter.trigger('resize');
        emitter.trigger('ready');

        global.addEventListener('resize', Contents.throttle(function () {
            emitter.trigger('resize');
        }, 100));

        global.addEventListener('scroll', Contents.throttle(function () {
            emitter.trigger('scroll');
        }, 100));
    }, 10);

    return emitter;
};

/**
 * @return {Number}
 */
Contents.windowHeight = function () {
    return global.innerHeight || global.document.documentElement.clientHeight;
};

/**
 * @return {Number}
 */
Contents.windowScrollY = function () {
    return global.pageYOffset || global.document.documentElement.scrollTop;
};

/**
 * Interpret execution configuration.
 * 
 * @param {Object} config
 * @return {Object}
 */
Contents.config = function (config) {
    var properties = ['articles', 'link'];

    config = config || {};

    Contents.forEach(Object.keys(config), function (name) {
        if (properties.indexOf(name) === -1) {
            throw new Error('Unknown configuration property.');
        }
    });

    if (config.articles) {
        if (!config.articles.length || !(config.articles[0] instanceof HTMLElement)) {
            throw new Error('Option "articles" is not a collection of HTMLElement objects.');
        }
    } else {
        config.articles = document.querySelectorAll('h1, h2, h3, h4, h5, h6');        
    }

    if (config.link) {
        if (typeof config.link !== 'function') {
            throw new Error('Option "link" must be a function.');
        }
    } else {
        config.link = Contents.link;
    }

    return config;
};

/**
 * Derive ID from articleName using formatId.
 * Ensure that ID is unique across the document.
 * 
 * @param {String} articleName
 * @param {Function} formatId
 * @return {String}
 */
Contents.id = function (articleName, formatId) {
    var formattedId,
        assignedId,
        i = 1;

    if (!formatId) {
        formatId = Contents.formatId;
    }

    formattedId = formatId(articleName);

    if (!formattedId.match(/^[a-z]+[a-z0-9\-_:\.]*$/)) {
        throw new Error('Invalid ID (' + formattedId + ').');
    }

    assignedId = formattedId;

    while (document.querySelector('#' + assignedId)) {
        assignedId = formattedId + '-' + (i++);
    }

    return assignedId;
};

/**
 * Format text into an ID/anchor safe value.
 *
 * @see http://stackoverflow.com/a/1077111/368691
 * @param {String} str
 * @return {String}
 */
Contents.formatId = function (str) {
    return str
        .toLowerCase()
        .replace(/[ãàáäâ]/g, 'a')
        .replace(/[ẽèéëê]/g, 'e')
        .replace(/[ìíïî]/g, 'i')
        .replace(/[õòóöô]/g, 'o')
        .replace(/[ùúüû]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]+/g, '-')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '')
        .replace(/^[^a-z]+/g, '');
};

/**
 * @param {NodeList} articles
 * @return {HTMLElement}
 */
Contents.makeList = function (articles) {
    var rootList = document.createElement('ol'),
        list = rootList,
        lastListInLevelIndex = [],
        lastListInLevelOrLower,
        lastListItem,
        lastLevel;

    lastListInLevelOrLower = function (level) {
        while (level > 0) {
            if (lastListInLevelIndex[level]) {
                return lastListInLevelIndex[level];
            }
            level--;
        }
        
        throw new Error('Invalid markup.');
    };

    Contents.forEach(articles, function (article) {
        var level,
            li = document.createElement('li');

        level = Contents.level(article);
        
        lastListInLevelIndex = lastListInLevelIndex.slice(0, level + 1);
        
        if (!lastLevel || lastLevel === level) {
            list.appendChild(li);
        } else if (lastLevel < level) {
            list = document.createElement('ol');
            list.appendChild(li);
            lastListItem.appendChild(list);
        } else {
            list = lastListInLevelOrLower(level);
            list.appendChild(li);
        }
        
        lastListInLevelIndex[level] = list;
        lastLevel = level;
        lastListItem = li;
    });

    return rootList;
};

/**
 * Extract element level used to construct list hierarchy, e.g. <h1> is 1, <h2> is 2.
 * When element is not a heading, use Contents.level data attribute. Default to 1.
 *
 * @param {HTMLElement} element
 * @return {Number}
 */
Contents.level = function (element) {
    var tagName = element.tagName.toLowerCase();

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(tagName) !== -1) {
        return parseInt(tagName.slice(1), 10);
    }

    if (element.dataset['gajus.contents.level'] !== undefined) {
        return parseInt(element.dataset['gajus.contents.level'], 10);
    }

    if (jQuery && jQuery.data(element, 'gajus.contents.level') !== undefined) {
        return jQuery.data(element, 'gajus.contents.level');
    }

    return 1;
};

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
        articleName = article.innerText || article.textContent,
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

/**
 * Produce a list of offset values for each element.
 * 
 * @param {NodeList} articles
 * @return {Array}
 */
Contents.indexOffset = function (elements) {
    var scrollYIndex = [],
        i = 0,
        j = elements.length,
        element,
        offset;

    while (i < j) {
        element = elements[i++];

        offset = element.offsetTop;

        // element.offsetTop might produce a float value.
        // Round to the nearest multiple of 5 (either up or down).
        // This is done to help readability and testing.
        offset = 5*(Math.round(offset/5));

        scrollYIndex.push(offset);
    }

    return scrollYIndex;
};

/**
 * Find the nearest value to the needle in the haystack and return the value index.
 * 
 * @see http://stackoverflow.com/a/26366951/368691
 * @param {Number} needle
 * @param {Array} haystack
 * @return {Number}
 */
Contents.getIndexOfClosestValue = function (needle, haystack) {
    var closestValueIndex = 0,
        lastClosestValueIndex,
        i = 0,
        j = haystack.length;
    
    if (!j) {
        throw new Error('Haystack must be not empty.');
    }

    while (i < j) {
        if (Math.abs(needle - haystack[closestValueIndex]) > Math.abs(haystack[i] - needle)) {
            closestValueIndex = i;
        }
        
        if (closestValueIndex === lastClosestValueIndex) {
            break;
        }
        
        lastClosestValueIndex = closestValueIndex;
        
        i++;
    }

    return closestValueIndex;
};

/**
 * @callback throttleCallback
 * @param {...*} var_args
 */

/**
 * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly,
 * will only call the original function at most once per every wait milliseconds.
 * 
 * @see https://remysharp.com/2010/07/21/throttling-function-calls
 * @param {throttleCallback} throttled
 * @param {Number} threshold Number of milliseconds between firing the throttled function.
 * @param {Object} context The value of "this" provided for the call to throttled.
 */
Contents.throttle = function (throttled, threshold, context) {
    var last,
        deferTimer;

    threshold = threshold || 250;
    context = context || {};
    
    return function () {
        var now = +new Date(),
            args = arguments;
        
        if (last && now < last + threshold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                throttled.apply(context, args);
            }, threshold);
        } else {
            last = now;
            throttled.apply(context, args);
        }
    };
};

/**
 * @callback forEachCallback
 * @param {Number} index
 */

/**
 * Iterates over elements of a collection, executing the callback for each element.
 * 
 * @param {Number} n The number of times to execute the callback.
 * @param {forEachCallback} callback
 */
Contents.forEach = function (collection, callback) {
    var i = 0,
        j = collection.length;

    while (i < j) {
        callback(collection[i], i);

        i++;
    }
};

global.gajus = window.gajus || {};
global.gajus.Contents = Contents;

module.exports = Contents;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"sister":1}]},{},[2])