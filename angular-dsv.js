/*
 * angular-dsv
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */

/* global angular:true */

(function () {
	'use strict';

  var app = angular.module('hc.dsv', []);

  app.factory('dsv', function ($http) {

    function dsvFactory(delimiter) {
      var delimiterCode = delimiter.charCodeAt(0);

      function dsv(requestConfig, f) {

        var config = {
          method: 'get',
          transformResponse: function(data) {
            return dsv.parse(data, f);
          }
        };
        angular.extend(config, requestConfig);
        return $http(config);
      }

      // from https://github.com/mbostock/d3/blob/master/src/dsv/dsv.js
      dsv.parseRows = function(text, f) {
        /* jshint -W004: false, -W030: false */
        var EOL = {}, // sentinel value for end-of-line
            EOF = {}, // sentinel value for end-of-file
            rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // the current line number
            t, // the current token
            eol; // is the current token followed by EOL?

        function token() {
          if (I >= N) return EOF; // special case: end of file
          if (eol) return eol = false, EOL; // special case: end of line

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
            return text.substring(j + 1, i).replace(/""/g, "\"");
          }

          // common case: find next delimiter or newline
          while (I < N) {
            var c = text.charCodeAt(I++), k = 1;
            if (c === 10) eol = true; // \n
            else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
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

      // from https://github.com/mbostock/d3/blob/master/src/dsv/dsv.js
      dsv.parse = function(data, f) {
        /* jshint -W054: false */
        var o;
        return dsv.parseRows(data, function(row, i) {
          if (o) return o(row, i - 1);
          var a = new Function("d", "return {" + row.map(function(name, i) {
            return JSON.stringify(name) + ": d[" + i + "]";
          }).join(",") + "}");
          o = f ? function(row, i) { return f(a(row), i); } : a;
        });
      };

      dsv.get = function(url, config, f) {
        return dsv(angular.extend(config || {}, {
          method: 'get',
          url: url
        }), f);
      };

      dsv.getRows = function(url, requestConfig, f) {
        var config = {
          method: 'get',
          url: url,
          transformResponse: function(data) {
            return dsv.parseRows(data, f);
          }
        };
        angular.extend(config, requestConfig);
        return $http(config);
      };

      return dsv;

    }

    dsvFactory.tsv = dsvFactory('\t');
    dsvFactory.csv = dsvFactory(',');

    return dsvFactory;

  });

}());
