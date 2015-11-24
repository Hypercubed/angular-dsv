(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularDsv = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global angular */

'use strict';

function d3_dsv_shim (delimiter) {
  var delimiterCode = delimiter.charCodeAt(0);

  var dsv = {};

  // from https://github.com/mbostock/d3/blob/master/src/dsv/dsv.js
  dsv.parseRows = function (text, f) {
    /* jshint -W004: false, -W030: false */
    var EOL = {}; // sentinel value for end-of-line
    var EOF = {}; // sentinel value for end-of-file
    var rows = []; // output rows
    var N = text.length;
    var I = 0; // current character index
    var n = 0; // the current line number
    var t; // the current token
    var eol; // is the current token followed by EOL?

    function token () {
      if (I >= N) return EOF; // special case: end of file
      if (eol) {
        eol = false;
        return EOL;
      } // special case: end of line

      // special case: quotes
      var j = I;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        var c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.substring(j + 1, i).replace(/""/g, '\"');
      }

      // common case: find next delimiter or newline
      while (I < N) {
        c = text.charCodeAt(I++);
        var k = 1;
        if (c === 10) eol = true; // \n
        else if (c === 13) {
          eol = true;
          if (text.charCodeAt(I) === 10) {
            ++I;
            ++k;
          }
        } // \r|\r\n
        else if (c !== delimiterCode) continue;
        return text.substring(j, I - k);
      }

      // special case: last token before EOF
      return text.substring(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (f && !(a = f(a, n++))) continue;
      rows.push(a);
    }

    return rows;
  };

  dsv.parse = function (data, f) {
    /*eslint no-new-func: 0*/
    var o;
    return dsv.parseRows(data, function (row, i) {
      if (o) return o(row, i - 1);
      var a = new Function('d', 'return {' + row.map(function (name, i) {
        return JSON.stringify(name) + ': d[' + i + ']';
      }).join(',') + '}');
      o = f ? function (row, i) { return f(a(row), i); } : a;
    });
  };

  return dsv;
}

function parseParams (requestConfig, f) {
  return angular.isFunction(requestConfig) ? {
    requestConfig: null,
    f: requestConfig
  } : {
    requestConfig: requestConfig,
    f: f
  };
}

function dsvFactory ($http, $window) {
  function factory (delimiter) {
    var d3_dsv = ($window.d3) ? $window.d3.dsv(delimiter) : d3_dsv_shim(delimiter);

    function dsv (requestConfig, f) {
      var config = {
        method: 'get',
        transformResponse: function (data) {
          return d3_dsv.parse(data, f);
        }
      };
      angular.extend(config, requestConfig);
      return $http(config);
    }

    dsv.parseRows = d3_dsv.parseRows;
    dsv.parse = d3_dsv.parse;

    dsv.get = function (url, requestConfig, f) {
      var params = parseParams(requestConfig, f);

      var config = {
        method: 'get',
        url: url
      };

      return dsv(
        angular.extend(config, params.requestConfig),
        params.f
      );
    };

    dsv.getRows = function (url, requestConfig, f) {
      var params = parseParams(requestConfig, f);

      var config = {
        method: 'get',
        url: url,
        transformResponse: function (data) {
          return d3_dsv.parseRows(data, params.f);
        }
      };

      return dsv(
        angular.extend(config, params.requestConfig),
        params.f
      );
    };

    return dsv;
  }

  factory.tsv = factory('\t');
  factory.csv = factory(',');

  return factory;
}

dsvFactory.$inject = ['$http', '$window'];

module.exports = 'hc.dsv';

angular.module('hc.dsv', [])
  .factory('dsv', dsvFactory);

},{}]},{},[1])(1)
});