var gajus,
    _ = {};

window.gajus = window.gajus || {};

gajus = window.gajus;

/**
 * @param {object} config
 * @return {jQuery} Table of contents element.
 */
gajus.contents = function (config) {
    var /**
         * @var {jQuery} Reference to the table of contents root element (<ol>).
         */
        list,
        listGuides;
    
    config = gajus.contents.config(config);

    list = gajus.contents.makeList(config.articles);
    listGuides = list.find('li');

    listGuides.each(function (i) {
        config.link($(this), config.articles.eq(i));
    });

    config.contents.append(list);        

    (function () {
        var ready,
            lastArticleIndex,
            /**
             * @var {Array}
             */
            articleOffsetIndex;

        list.on('resize.gajus.contents', function (event, data) {
            var windowHeight = $(window).height();

            articleOffsetIndex = gajus.contents.indexOffset(config.articles);

            if (!ready) {
                ready = true;

                $(window).on('scroll', gajus.contents.throttle(function () {
                    var articleIndex,
                        changeEvent;

                    articleIndex = gajus.contents.getIndexOfClosestValue($(window).scrollTop() + windowHeight * 0.2, articleOffsetIndex);

                    if (articleIndex !== lastArticleIndex) {
                        changeEvent = {};

                        changeEvent.current = {
                            article: config.articles.eq(articleIndex),
                            guide: listGuides.eq(articleIndex)
                        };

                        if (lastArticleIndex !== undefined) {
                            changeEvent.previous = {
                                article: config.articles.eq(lastArticleIndex),
                                guide: listGuides.eq(lastArticleIndex)
                            };
                        }

                        list.trigger('change.gajus.contents', changeEvent);

                        lastArticleIndex = articleIndex;
                    }

                    
                }, 100));

                list.trigger('ready.gajus.contents');
            }

            $(window).trigger('scroll');
        });

        $(window).on('resize orientationchange', gajus.contents.throttle(function () {
            list.trigger('resize.gajus.contents');
        }, 100));

        // This allows the script that constructs gajus.contents
        // to catch the first resize and scroll events.
        setTimeout(function () {
            list.trigger('resize.gajus.contents');
        }, 10);
    } ());

    return list;
};

/**
 * Interpret execution configuration.
 * 
 * @param {Object} config
 * @return {Object}
 */
gajus.contents.config = function (config) {
    var properties = ['contents', 'articles', 'link'];

    config = config || {};

    $.each(config, function (name) {
        if (properties.indexOf(name) === -1) {
            throw new Error('Unknown configuration property.');
        }
    });

    if (!config.contents) {
        throw new Error('Option "contents" is not set.');
    } else if (!(config.contents instanceof jQuery)) {
        throw new Error('Option "contents" is not a jQuery object.');
    }

    if (config.articles) {
        if (!(config.articles instanceof jQuery)) {
            throw new Error('Option "articles" is not a jQuery object.');
        }
    } else {
        config.articles = $('body').find('h1, h2, h3, h4, h5, h6');          
    }

    if (config.link) {
        if (typeof config.link !== 'function') {
            throw new Error('Option "link" must be a function.');
        }
    } else {
        config.link = gajus.contents.link;
    }

    return config;
};

/**
 * Derive a unique ID from article name.
 * 
 * @param {String} articleName
 * @param {Function} formatId
 * @return {String}
 */
gajus.contents.id = function (articleName, formatId) {
    var formattedId,
        assignedId,
        i = 1;

    if (!formatId) {
        formatId = gajus.contents.formatId;
    }

    formattedId = formatId(articleName);

    if (!formattedId.match(/^[a-z]+[a-z0-9\-_:\.]*$/)) {
        throw new Error('Invalid ID.');
    }

    assignedId = formattedId;

    while ($(document).find('#' + assignedId).length) {
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
gajus.contents.formatId = function (str) {
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
 * @param {jQuery} articles
 * @return {jQuery}
 */
gajus.contents.makeList = function (articles) {
    var rootList = $('<ol>'),
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
        
    articles.each(function () {
        var article = $(this),
            level,
            li = $('<li>');

        level = gajus.contents.level(article);
        
        lastListInLevelIndex = lastListInLevelIndex.slice(0, level + 1);
        
        if (!lastLevel || lastLevel === level) {
            list.append(li);
        } else if (lastLevel < level) {
            list = $('<ol>');
            list.append(li);
            lastListItem.append(list);
        } else {
            list = lastListInLevelOrLower(level);
            list.append(li);
        }
        
        lastListInLevelIndex[level] = list;
        lastLevel = level;
        lastListItem = li;
    });

    return rootList;
};

/**
 * Extract element level used to construct list hierarchy, e.g. <h1> is 1, <h2> is 2.
 * When element is not a heading, use gajus.contents.level data attribute. Default to 1.
 *
 * @param {jQuery} element
 * @return {Number}
 */
gajus.contents.level = function (element) {
    var tagName = element.prop('tagName').toLowerCase();

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(tagName) !== -1) {
        return parseInt(tagName.slice(1), 10);
    }
    
    return element.data('gajus.contents.level') || 1;
};

/**
 * This function is called after the table of contents is generated.
 * It is called for each article in the index.
 * Used to represent article in the table of contents and to setup navigation.
 * 
 * @param {jQuery} guide An element in the table of contents representing an article.
 * @param {jQuery} article The represented content element.
 */
gajus.contents.link = function (guide, article) {
    var guideLink = $('<a>'),
        articleLink = $('<a>'),
        articleName = article.text(),
        articleId = article.attr('id') || gajus.contents.id(articleName);

    guideLink
        .text(articleName)
        .attr('href', '#' + articleId)
        .prependTo(guide);

    articleLink
        .attr('href', '#' + articleId);

    article
        .attr('id', articleId)
        .wrapInner(articleLink);
};

/**
 * Produce a list of scrollY values for each element.
 * 
 * @param {jQuery} articles
 * @return {Array}
 */
gajus.contents.indexOffset = function (elements) {
    var scrollYIndex = [];

    elements.each(function () {
        var offset = $(this).offset().top;

        // Round to nearest multiple of 5 (either up or down).
        // The deductOffset usually comes from $(window).height()/3
        // element.offset().top itself might produce a float values.
        // This is done for readability and testing.
        offset = 5*(Math.round(offset/5));

        scrollYIndex.push(offset);
    });

    return scrollYIndex;
};

/**
 * Find the nearest value to the needle in the haystack and return the value index.
 * 
 * @see http://stackoverflow.com/a/26366951/368691
 * @param {Number} needle
 * @param {Array} haystack
 * @return {jQuery}
 */
gajus.contents.getIndexOfClosestValue = function (needle, haystack) {
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
 * @callback throttled
 * @param {...*} var_args
 */

/**
 * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly,
 * will only actually call the original function at most once per every wait milliseconds.
 * 
 * @see https://remysharp.com/2010/07/21/throttling-function-calls
 * @param {throttled} throttled
 * @param {Number} threshold Number of milliseconds between firing the throttled function.
 * @param {Object} context The value of "this" provided for the call to throttled.
 */
gajus.contents.throttle = function (throttled, threshold, context) {
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