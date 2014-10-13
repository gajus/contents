(function ($) {
    'use strict';

    $.gajus = $.gajus || {};

    /**
     * @return {jQuery} Table of contents element. Used as event proxy.
     */
    $.gajus.contents = function (options) {
        var headings,
            list,
            offsetIndex,
            lastHeading;
        
        options = $.gajus.contents.options(options);
        
        headings = options.index || $.gajus.contents.getHeadings(options.content);

        $.gajus.contents.giveId(headings, options.anchorFormatter);

        list = $.gajus.contents.generateHeadingHierarchyList(headings, options.itemFormatter);

        options.where.append(list);

        list.on('resize.contents.gajus', function (event, data) {
            offsetIndex = $.gajus.contents.offsetIndex(headings, options.offsetCalculator);

            $(window).trigger('scroll');
        });

        $(window).on('resize orientationchange', $.gajus.contents.throttle(function () {
            list.trigger('resize.contents.gajus');
        }, 100));

        $(window).on('scroll', $.gajus.contents.throttle(function () {
            var heading,
                changeEvent;

            if (!offsetIndex) {
                return;
            }

            heading = $.gajus.contents.getInOffsetIndex($.gajus.contents.scrollTop(), offsetIndex).element;

            if (lastHeading !== heading) {
                changeEvent = {};
                
                changeEvent.current = {
                    heading: heading,
                    anchor: list.find('li').filter(function () { return $(this).data('gajus.contents.heading') === heading[0]; })
                };

                if (lastHeading) {
                    changeEvent.previous = {
                        heading: lastHeading,
                        anchor: list.find('li').filter(function () { return $(this).data('gajus.contents.heading') === lastHeading[0]; })
                    };
                }

                list.trigger('change.gajus.contents', changeEvent);

                lastHeading = heading;
            }
        }, 100));

        // This allows the script that constructs $.gajus.contents
        // to catch the first scroll event.
        setTimeout(function () {
            list.trigger('resize.contents.gajus');
        }, 10);

        return list;
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
    $.gajus.contents.throttle = function (throttled, threshold, context) {
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
     * Interpret execution options.
     * 
     * @return {Object}
     */
    $.gajus.contents.options = function (options) {
        if (!options) {
            throw new Error('Missing setup options.');
        }

        // @todo Issue a warning about unknown properties.

        if (!options.where) {
            throw new Error('Option "where" is not set.');
        } else if (!(options.where instanceof jQuery)) {
            throw new Error('Option "where" is not a jQuery object.');
        } else if (!options.where.length) {
            throw new Error('Option "where" does not refer to an existing element.');
        } else if (options.where.length > 1) {
            throw new Error('Option "where" refers to more than one element.');
        }

        if (options.index && options.content) {
            throw new Error('Cannot set "index" and "content" options together.');
        } else if (options.index) {
            if (!(options.index instanceof jQuery)) {
                throw new Error('Option "index" is not a jQuery object.');
            }
        } else if (options.content) {
            if (!(options.content instanceof jQuery)) {
                throw new Error('Option "content" is not a jQuery object.');
            }
        } else {
            throw new Error('Must set either "index" or "content" option.');
        }

        if (options.itemFormatter) {
            if (typeof options.itemFormatter !== 'function') {
                throw new Error('Option "itemFormatter" must be a function.');
            }
        } else {
            options.itemFormatter = $.gajus.contents.itemFormatter;
        }

        if (options.anchorFormatter) {
            if (typeof options.anchorFormatter !== 'function') {
                throw new Error('Option "anchorFormatter" must be a function.');
            }
        } else {
            options.anchorFormatter = $.gajus.contents.anchorFormatter;
        }

        if (options.headingFormatter) {
            if (typeof options.headingFormatter !== 'function') {
                throw new Error('Option "headingFormatter" must be a function.');
            }
        }

        if (options.offsetCalculator) {
            if (typeof options.offsetCalculator !== 'function') {
                throw new Error('Option "offsetCalculator" must be a function.');
            }
        } else {
            options.offsetCalculator = $.gajus.contents.offsetIndex.offsetCalculator;
        }

        return options;
    };

    /**
     * Get all the heading elements within the target element(s).
     * 
     * @param {jQuery} target Reference to the body of the document.
     * @return {jQuery} References to all of the headings within the target.
     */
    $.gajus.contents.getHeadings = function (target) {
        return target.find('h1, h2, h3, h4, h5, h6');
    };

    /**
     * Derive URL save string from the heading text and use it for the "id" attribute.
     * 
     * @param {jQuery} element
     * @param {Function} anchorFormatter
     * @return {String} Unique ID derived from the heading text.
     */
    $.gajus.contents.deriveId = function (element, anchorFormatter) {
        var text,
            anchorName,
            id,
            i = 1;

        if (!anchorFormatter) {
            anchorFormatter = $.gajus.contents.anchorFormatter;
        }

        if (element.length != 1) {
            throw new Error('Must reference a single element.');
        }

        if (element.attr('id')) {
            throw new Error('Already has an ID.');
        }

        text = element.text();

        if (!text.length) {
            throw new Error('Must have text.');
        }

        anchorName = anchorFormatter(text);

        id = anchorName;

        while ($(document).find('#' + id).length) {
            id = anchorName + '-' + (i++);
        }

        return id;
    };

    /**
     * Ensure that each element has an ID.
     *
     * @param {jQuery} elements
     * @param {Function} slugFilter
     */
    $.gajus.contents.giveId = function (elements, slugFilter) {
        elements.each(function () {
            var element = $(this);

            if (!element.attr('id')) {
                element.attr('id', $.gajus.contents.deriveId(element, slugFilter));
            }
        });
    };

    /**
     * Format text into ID/anchor safe value.
     *
     * @see http://stackoverflow.com/a/1077111/368691
     * @param {String} str Arbitrary string.
     * @return {String}
     */
    $.gajus.contents.anchorFormatter = function (str) {
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
     * @param {jQuery} headings Reference to the headings.
     * @param {$.gajus.contents.itemFormatter} itemFormatter
     * @return {jQuery}
     */
    $.gajus.contents.generateHeadingHierarchyList = function (headings, itemFormatter) {
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
            
        headings.each(function () {
            var heading = $(this),
                level = parseInt(heading.prop('tagName').slice(1), 10),
                li = $('<li>');

            li.data('gajus.contents.heading', heading[0]);

            itemFormatter(li, heading);
            
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
     * @param {jQuery} li List element.
     * @param {jQuery} heading Heading element.
     */
    $.gajus.contents.itemFormatter = function (li, heading, anchorName) {
        var headingLink = $('<a>'),
            listlink = $('<a>');

        listlink.text(heading.text());
        listlink.attr('href', '#' + heading.attr('id'));

        li.append(listlink);

        headingLink.attr('href', '#' + heading.attr('id'));

        heading.wrapInner(headingLink);
    };

    /**
     * Returns the number of pixels that the document has already been scrolled vertically.
     * Used to control the $(window).scrollTop() value in the BDD environment.
     * viewportSize (http://phantomjs.org/api/webpage/property/viewport-size.html)
     * cannot be controlled consistently in all browsers.
     *
     * @return {Number}
     */
    $.gajus.contents.scrollTop = function () {
        return $.gajus.contents._scrollTop ? $.gajus.contents._scrollTop : $(window).scrollTop();
    };

    /**
     * @var {Number} Used to overwrite $.gajus.contents.scrollTop() value in testing environment.
     */
    $.gajus.contents._scrollTop = null;

    /**
     * List headings and their vertical offset.
     * The index must be manually updated each time that the window size changes.
     * 
     * @param {jQuery} headings Reference to the headings.
     * @param {$.gajus.contents.offsetIndex.offsetCalculator} offsetCalculator Function used to calculate number of pixels to move the offset up.
     * @return {Array}
     */
    $.gajus.contents.offsetIndex = function (headings, offsetCalculator) {
        var index = [],
            deductOffset = 0;

        if (offsetCalculator) {
            deductOffset = offsetCalculator();
        }

        headings.each(function () {
            var element = $(this),
                realOffset = element.offset().top,
                offset = realOffset;

            //if (element.css('marginTop')) {
            //    offset -= parseInt(element.css('marginTop'), 10);
            //}

            offset -= deductOffset;
            // Round to nearest multiple of 5 (either up or down).
            // The deductOffset usually comes from $(window).height()/3
            // element.offset().top itself might produce a float values.
            // This is done for readability and testing.
            offset = 5*(Math.round(offset/5));

            index.push({
                element: element,
                offset: offset,
                realOffset: realOffset
            });
        });
        return index;
    };

    /**
     * @return {Number}
     */
    $.gajus.contents.offsetIndex.offsetCalculator = function () {
        return $(window).height() / 3;
    };

    /**
     * @param {Number} scrollTop Refers to a derived value from $.gajus.contents.scrollTop.
     * @param {Array} offsetIndex List of all headings and their vertical offset.
     * @return {jQuery} The nearest match heading reference.
     */
    $.gajus.contents.getInOffsetIndex = function (scrollTop, offsetIndex) {
        var i = 0;

        if (offsetIndex[0].offset > scrollTop) {
            return offsetIndex[0];
        }

        while (i < offsetIndex.length) {
            if (scrollTop >= offsetIndex[i].offset && (!offsetIndex[i + 1] || scrollTop < offsetIndex[i + 1].offset)) {
                return offsetIndex[i];
            }

            i++;
        }
    };
} (jQuery));