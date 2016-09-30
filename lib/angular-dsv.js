/* global angular */

'use strict';

var d3DSV = require('d3-dsv').dsv;

function parseParams (requestConfig, f) {
  return angular.isFunction(requestConfig) ? {
    requestConfig: null,
    f: requestConfig
  } : {
    requestConfig: requestConfig,
    f: f
  };
}

dsvFactory.$inject = ['$http'];
function dsvFactory ($http) {
  function factory (delimiter) {
    var _dsv = d3DSV(delimiter);

    function dsv (requestConfig, f) {
      var config = {
        method: 'get',
        transformResponse: function (data, headers, status) {
          return status >= 200 && status < 300 ? _dsv.parse(data, f) : [];
        }
      };
      angular.extend(config, requestConfig);
      return $http(config);
    }

    dsv.parseRows = _dsv.parseRows;
    dsv.parse = _dsv.parse;

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
        transformResponse: function (data, headers, status) {
          return status >= 200 && status < 300 ? _dsv.parseRows(data, params.f) : [];
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

module.exports = 'hc.dsv';

angular.module('hc.dsv', [])
  .factory('dsv', dsvFactory);
