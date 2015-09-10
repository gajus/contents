'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashCollectionForEach = require('lodash/collection/forEach');

var _lodashCollectionForEach2 = _interopRequireDefault(_lodashCollectionForEach);

var _lodashCollectionMap = require('lodash/collection/map');

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashObjectAssign = require('lodash/object/assign');

var _lodashObjectAssign2 = _interopRequireDefault(_lodashObjectAssign);

var _lodashArrayDifference = require('lodash/array/difference');

var _lodashArrayDifference2 = _interopRequireDefault(_lodashArrayDifference);

exports['default'] = {
    forEach: _lodashCollectionForEach2['default'],
    map: _lodashCollectionMap2['default'],
    assign: _lodashObjectAssign2['default'],
    difference: _lodashArrayDifference2['default']
};
module.exports = exports['default'];