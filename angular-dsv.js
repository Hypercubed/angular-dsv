/*
 * angular-dsv
 * (c) 2014-2015 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */

/* global angular:true */

(function () {
  'use strict';

  function d3_dsv_shim(delimiter) {
    var delimiterCode = delimiter.charCodeAt(0);

    var dsv = {};

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

    return dsv;
  }

	function parseParams(requestConfig, f){
		return angular.isFunction(requestConfig) ? {
			requestConfig: null,
			f: requestConfig
		} : {
			requestConfig: requestConfig,
			f: f
		};
	}

  function dsvFactory($http, $window) {

    function factory(delimiter) {

			var d3_dsv = ($window.d3) ? $window.d3.dsv(delimiter) : d3_dsv_shim(delimiter);

      function dsv(requestConfig, f) {
        var config = {
          method: 'get',
          transformResponse: function(data) {
            return d3_dsv.parse(data, f);
          }
        };
        angular.extend(config, requestConfig);
        return $http(config);
      }

      dsv.parseRows = d3_dsv.parseRows;
      dsv.parse = d3_dsv.parse;

      dsv.get = function(url, requestConfig, f) {
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

      dsv.getRows = function(url, requestConfig, f) {
        var params = parseParams(requestConfig, f);

        var config = {
          method: 'get',
          url: url,
          transformResponse: function(data) {
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

  angular.module('hc.dsv', [])
    .factory('dsv', dsvFactory);

}());
