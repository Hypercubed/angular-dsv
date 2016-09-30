/* global describe, it, beforeEach, inject, expect */
/* eslint max-nested-callbacks: 0 */

// TODO: test ng-include

describe('Factory: dsv', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('hc.dsv'));

  var dsv;
  var $httpBackend;

  beforeEach(inject(function (_$httpBackend_, _dsv_) {
    dsv = _dsv_;
    $httpBackend = _$httpBackend_;
  }));

  /* var element,
    $scope,
    $httpBackend,
    $compile,
    markdown, html;

  beforeEach(inject(function ($rootScope, $templateCache, _$httpBackend_, _$compile_) {

    $scope = $rootScope.$new();

    $httpBackend = _$httpBackend_;
    $compile = _$compile_;

    $httpBackend.expect('GET', $scope.file).respond('');

  })); */

  describe('csv', function () {
    describe('#get', function () {
      it('should load a file', function () {
        $httpBackend.expectGET('test.csv')
          .respond('a,b,c\n1,2,3\n4,5,6\n7,8,9');

        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];

        dsv
          .csv
          .get('test.csv')
          .then(function (response) {
            expect(response.data).toEqual(expected);
          });

        $httpBackend.flush();
      });

      it('should correctly handle canceled requests', inject(function ($q, $rootScope) {
        $httpBackend.expectGET('test.csv')
          .respond('a,b,c\n1,2,3\n4,5,6\n7,8,9');

        var responseData;
        var canceler = $q.defer();

        dsv.csv.get('test.csv', {timeout: canceler.promise}).catch(function (err) {
          responseData = err.data;
        });

        canceler.resolve();
        $rootScope.$apply();

        expect(responseData).toEqual([]);
      }));

      it('should correctly handle HTTP errors', function () {
        $httpBackend.expectGET('test.csv')
          .respond(403, 'Error');

        var responseData;

        dsv.csv.get('test.csv').catch(function (err) {
          responseData = err.data;
        });

        $httpBackend.flush();

        expect(responseData).toEqual([]);
      });
    });

    describe('#getRows', function () {
      it('should load a file', function () {
        $httpBackend.expectGET('test.csv')
          .respond('a,b,c\n1,2,3\n4,5,6\n7,8,9');

        dsv.csv.getRows('test.csv').then(function (response) {
          expect(response.data).toEqual([
            ['a', 'b', 'c'],
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9']
          ]);
        });

        $httpBackend.flush();
      });

      it('should correctly handle canceled requests', inject(function ($q, $rootScope) {
        $httpBackend.expectGET('test.csv')
          .respond('a,b,c\n1,2,3\n4,5,6\n7,8,9');

        var responseData;
        var canceler = $q.defer();

        dsv.csv.getRows('test.csv', {timeout: canceler.promise}).catch(function (err) {
          responseData = err.data;
        });

        canceler.resolve();
        $rootScope.$apply();

        expect(responseData).toEqual([]);
      }));

      it('should correctly handle HTTP errors', function () {
        $httpBackend.expectGET('test.csv')
          .respond(403, 'Error');

        var responseData;

        dsv.csv.getRows('test.csv').catch(function (err) {
          responseData = err.data;
        });

        $httpBackend.flush();

        expect(responseData).toEqual([]);
      });
    });

    describe('#parse', function () {
      it('returns an array of objects with the additional `columns` field', function () {
        var expected = [{a: '1', b: '2', c: '3'}];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.csv.parse('a,b,c\n1,2,3\n')).toEqual(expected);
      });

      it('parses quoted values', function () {
        var expected = [{a: '1', b: 'he,l\tlo', c: '3'}];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.csv.parse('a,b,c\n1,"he,l\tlo",3\n')).toEqual(expected);
      });

      it('parses unix newlines', function () {
        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.csv.parse('a,b,c\n1,2,3\n4,5,"6"\n7,8,9')).toEqual(expected);
      });

      it('parses mac newlines', function () {
        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.csv.parse('a,b,c\r1,2,3\r4,5,"6"\r7,8,9')).toEqual(expected);
      });

      it('parses dos newlines', function () {
        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.csv.parse('a,b,c\r\n1,2,3\r\n4,5,"6"\r\n7,8,9')).toEqual(expected);
      });
    });
  });

  describe('tsv', function () {
    describe('#get', function () {
      it('should load a file', function () {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];

        dsv.tsv.get('test.tsv').then(function (response) {
          expect(response.data).toEqual(expected);
        });

        $httpBackend.flush();
      });

      it('should correctly handle canceled requests', inject(function ($q, $rootScope) {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        var responseData;
        var canceler = $q.defer();

        dsv.tsv.get('test.tsv', {timeout: canceler.promise}).catch(function (err) {
          responseData = err.data;
        });

        canceler.resolve();
        $rootScope.$apply();

        expect(responseData).toEqual([]);
      }));

      it('should correctly handle HTTP errors', function () {
        $httpBackend.expectGET('test.tsv')
          .respond(403, 'Error');

        var responseData;

        dsv.tsv.get('test.tsv').catch(function (err) {
          responseData = err.data;
        });

        $httpBackend.flush();

        expect(responseData).toEqual([]);
      });

      it('should accept a config object and accessor function', function () {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        var expected = [6, 15, 24];
        expected.columns = ['a', 'b', 'c'];

        dsv
          .tsv
          .get('test.tsv', {cache: true}, function (d) {
            return (Number(d.a) + Number(d.b) + Number(d.c));
          })
          .then(function (response) {
            expect(response.data).toEqual(expected);
          });

        $httpBackend.flush();
      });

      it('config object should be optional', function () {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        var expected = [6, 15, 24];
        expected.columns = ['a', 'b', 'c'];

        dsv.tsv.get('test.tsv', function (d) {
          return (Number(d.a) + Number(d.b) + Number(d.c));
        })
        .then(function (response) {
          expect(response.data).toEqual(expected);
        });

        $httpBackend.flush();
      });
    });

    describe('#getRows', function () {
      it('should load a file', function () {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        dsv.tsv.getRows('test.tsv').then(function (response) {
          expect(response.data).toEqual([
            ['a', 'b', 'c'],
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9']
          ]);
        });

        $httpBackend.flush();
      });

      it('should correctly handle canceled requests', inject(function ($q, $rootScope) {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        var responseData;
        var canceler = $q.defer();

        dsv.tsv.getRows('test.tsv', {timeout: canceler.promise}).catch(function (err) {
          responseData = err.data;
        });

        canceler.resolve();
        $rootScope.$apply();

        expect(responseData).toEqual([]);
      }));

      it('should correctly handle HTTP errors', function () {
        $httpBackend.expectGET('test.tsv')
          .respond(403, 'Error');

        var responseData;

        dsv.tsv.getRows('test.tsv').catch(function (err) {
          responseData = err.data;
        });

        $httpBackend.flush();

        expect(responseData).toEqual([]);
      });

      it('should accept a config object and accessor function', function () {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        dsv.tsv.getRows('test.tsv', {}, function (d) {
          return {values: d};
        }).then(function (response) {
          expect(response.data).toEqual([
            {values: ['a', 'b', 'c']},
            {values: ['1', '2', '3']},
            {values: ['4', '5', '6']},
            {values: ['7', '8', '9']}
          ]);
        });

        $httpBackend.flush();
      });

      it('config object should be optional', function () {
        $httpBackend.expectGET('test.tsv')
          .respond('a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9');

        dsv
          .tsv
          .getRows('test.tsv', function (d) {
            return {values: d};
          })
          .then(function (response) {
            expect(response.data).toEqual([
              {values: ['a', 'b', 'c']},
              {values: ['1', '2', '3']},
              {values: ['4', '5', '6']},
              {values: ['7', '8', '9']}
            ]);
          });

        $httpBackend.flush();
      });
    });

    describe('#parse', function () {
      it('returns an array of objects with the additional `columns` field', function () {
        var expected = [{a: '1', b: '2', c: '3'}];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.tsv.parse('a\tb\tc\n1\t2\t3\n')).toEqual(expected);
      });

      it('parses quoted values', function () {
        var expected = [{a: '1', b: 'he,l\tlo', c: '3'}];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.tsv.parse('a\tb\tc\n1\t"he,l\tlo"\t3\n')).toEqual(expected);
      });

      it('parses unix newlines', function () {
        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.tsv.parse('a\tb\tc\n1\t2\t3\n4\t5\t"6"\n7\t8\t9')).toEqual(expected);
      });

      it('parses mac newlines', function () {
        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.tsv.parse('a\tb\tc\r1\t2\t3\r4\t5\t"6"\r7\t8\t9')).toEqual(expected);
      });

      it('parses dos newlines', function () {
        var expected = [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'},
          {a: '7', b: '8', c: '9'}
        ];
        expected.columns = ['a', 'b', 'c'];
        expect(dsv.tsv.parse('a\tb\tc\r\n1\t2\t3\r\n4\t5\t"6"\r\n7\t8\t9')).toEqual(expected);
      });
    });

    describe('#parseRows', function () {
      it('returns an array of arrays', function () {
        expect(dsv.tsv.parseRows('a\tb\tc\n1\t2\t3\n4\t5\t"6"\n7\t8\t9')).toEqual([
          ['a', 'b', 'c'],
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9']
        ]);
      });
    });
  });
});
