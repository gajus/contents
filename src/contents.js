/**
 * @link https://github.com/gajus/contents for the canonical source repository
 * @license https://github.com/gajus/contents/blob/master/LICENSE BSD 3-Clause
 */
(function ($) {
    'use strict';

    $.gajus = $.gajus || {};

    $.gajus.contents = function (options) {
        var headings,
            list,
            offsetIndex,
            lastHeading;
        //options = $.extend({}, defaultOptions, options);

        if (!options.where) {
            throw new Error('Option "where" is not set.');
        } else if (!options.where.length) {
            throw new Error('Option "where" does refer to an existing container.');
        }

        if (!options.content) {
            throw new Error('Option "content" is not set.');
        } else if (!options.content.length) {
            throw new Error('Option "content" does refer to an existing container.');
        }

        if (!options.slug) {
            options.slug = $.gajus.contents.toSlug;
        }

        if (!options.offset) {
            // @todo Must change when the window size is changed.
            options.offset = $(window).height()/3;
        }

        headings = $.gajus.contents.getHeadings(options.content);

        if (!headings.length) {
            throw new Error('"content" area does not have headings.');
        }

        $.gajus.contents.giveId(headings, options.slug);

        list = $.gajus.contents.generateHeadingHierarchyList(headings);

        options.where.append(list);

        offsetIndex = $.gajus.contents.offsetIndex(headings, options.offset);

        $(window).on('scroll', function () {
            var heading,
                changeEvent;

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
        });

        setTimeout(function () {
            list.trigger('scroll');
        }, 10);

        return list;
    };

    /**
     * Get all the heading elements within the target element(s).
     * 
     * @param {jQuery} target Reference to the body of the document.
     * @return {jQuery} References to all of the headings within the target.
     */
    $.gajus.contents.getHeadings = function (target) {
        var headings;

        if (!target.length) {
            throw new Error('Target element does not exist.');
        }

        headings = target.find('h1, h2, h3, h4, h5, h6');

        if (!headings.length) {
            throw new Error('Target element does not contain heading elements.');
        }

        return headings;
    };

    /**
     * Derive URL save string from the heading text and use it for the "id" attribute.
     * 
     * @param {jQuery} element
     * @param {Function} slugFilter
     * @return {String} Unique ID derived from the heading text.
     */
    $.gajus.contents.deriveId = function (element, slugFilter) {
        var text,
            slug,
            id,
            i = 1;

        if (!slugFilter) {
            slugFilter = $.gajus.contents.toSlug;
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

        slug = slugFilter(text);

        id = slug;

        while ($(document).find('#' + id).length) {
            id = slug + '-' + (i++);
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
     * Make string url-safe.
     *
     * @param {String} str Arbitrary string.
     * @return {String}
     */
    $.gajus.contents.toSlug = function (str) {
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
            .replace(/^\-|\-$/g, '');
    };

    /**
     * @callback itemInterpreter
     * @param {jQuery} listItem List item.
     */

    /**
     * @param {jQuery} headings Reference to the headings.
     * @param {itemInterpreter} itemInterpreter
     * @return {jQuery}
     */
    $.gajus.contents.generateHeadingHierarchyList = function (headings, itemInterpreter) {
        var rootList = $('<ul>'),
            list = rootList,
            lastListInLevelIndex = [],
            lastListInLevelOrLower,
            lastListItem,
            lastLevel;


        if (!itemInterpreter) {
            itemInterpreter = function (li, heading) {
                var hyperlink = $('<a>');

                hyperlink.text(heading.text());
                hyperlink.attr('href', '#' + heading.attr('id'));

                li.append(hyperlink);
            };
        }

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

            itemInterpreter(li, heading);
            
            lastListInLevelIndex = lastListInLevelIndex.slice(0, level + 1);
            
            if (!lastLevel || lastLevel === level) {
                list.append(li);
            } else if (lastLevel < level) {
                list = $('<ul>');
                list.append(li);
                lastListItem.append(list);
            } else {
                lastListInLevelOrLower(level).append(li);
            }
            
            lastListInLevelIndex[level] = list;
            lastLevel = level;
            lastListItem = li;
        });

        return rootList;
    };

    $.gajus.contents._scrollTop = null;

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
     * List headings and their vertical offset.
     * The index must be manually updated each time that the window size changes.
     * 
     * @param {jQuery} headings Reference to the headings.
     * @param {Number} deductOffset Number of pixels to move the offset up.
     * @return {Array}
     */
    $.gajus.contents.offsetIndex = function (headings, deductOffset) {
        var index = [];

        deductOffset = deductOffset || 0;

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