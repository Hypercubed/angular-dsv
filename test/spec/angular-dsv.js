
// TODO: test ng-include

describe('Factory: dsv', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('hc.dsv'));

  var dsv, $httpBackend;

  beforeEach(inject(function(_$httpBackend_, _dsv_) {
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

  describe('csv', function() {

    describe('#get', function() {
      it('should load a file', function(done) {

        $httpBackend.expectGET('test.csv')
          .respond("a,b,c\n1,2,3\n4,5,6\n7,8,9");

        dsv.csv.get('test.csv').then(function(response) {
          expect(response.data).toEqual([
            {a: "1", b: "2", c: "3"},
            {a: "4", b: "5", c: "6"},
            {a: "7", b: "8", c: "9"}
          ]);
        });

        $httpBackend.flush();

      })
    });

    describe('#getRows', function() {
      it('should load a file', function(done) {

        $httpBackend.expectGET('test.csv')
          .respond("a,b,c\n1,2,3\n4,5,6\n7,8,9");

        dsv.csv.getRows('test.csv').then(function(response) {
          expect(response.data).toEqual([
            ["a","b","c"],
            ["1", "2","3"],
            ["4", "5", "6"],
            ["7", "8", "9"]
          ]);
        });

        $httpBackend.flush();

      })
    });

    describe('#parse', function() {
      it('returns an array of objects', function() {
        expect(dsv.csv.parse("a,b,c\n1,2,3\n")).toEqual([{a: "1", b: "2", c: "3"}]);
      })

      it('parses quoted values', function() {
        expect(dsv.csv.parse("a,b,c\n1,\"he,l\tlo\",3\n")).toEqual([{a: "1", b: "he,l\tlo", c: "3"}]);
      })

      it('parses unix newlines', function() {
        expect(dsv.csv.parse("a,b,c\n1,2,3\n4,5,\"6\"\n7,8,9")).toEqual([
          {a: "1", b: "2", c: "3"},
          {a: "4", b: "5", c: "6"},
          {a: "7", b: "8", c: "9"}
        ]);
      });

      it('parses mac newlines', function() {
        expect(dsv.csv.parse("a,b,c\r1,2,3\r4,5,\"6\"\r7,8,9")).toEqual([
          {a: "1", b: "2", c: "3"},
          {a: "4", b: "5", c: "6"},
          {a: "7", b: "8", c: "9"}
        ]);
      });

      it('parses dos newlines', function() {
        expect(dsv.csv.parse("a,b,c\r\n1,2,3\r\n4,5,\"6\"\r\n7,8,9")).toEqual([
          {a: "1", b: "2", c: "3"},
          {a: "4", b: "5", c: "6"},
          {a: "7", b: "8", c: "9"}
        ]);
      });

    })
  })

  describe('tsv', function() {

    describe('#get', function() {
      it('should load a file', function(done) {

        $httpBackend.expectGET('test.tsv')
          .respond("a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9");

        dsv.tsv.get('test.tsv').success(function(data) {
          expect(data).toEqual([
            {a: "1", b: "2", c: "3"},
            {a: "4", b: "5", c: "6"},
            {a: "7", b: "8", c: "9"}
          ]);
        });

        $httpBackend.flush();

      })

      it('should accept a config object and accessor function', function(done) {

        $httpBackend.expectGET('test.tsv')
          .respond("a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9");

        dsv.tsv.get('test.tsv', { cache: true }, function(d) { return (+d.a + +d.b + +d.c) }).success(function(data) {
          expect(data).toEqual([
            6,
            15,
            24
          ]);
        });

        $httpBackend.flush();

      })

      it('config object should be optional', function(done) {

        $httpBackend.expectGET('test.tsv')
          .respond("a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9");

        dsv.tsv.get('test.tsv', function(d) { return (+d.a + +d.b + +d.c) }).success(function(data) {
          expect(data).toEqual([
            6,
            15,
            24
          ]);
        });

        $httpBackend.flush();

      })

    });

    describe('#getRows', function() {
      it('should load a file', function(done) {

        $httpBackend.expectGET('test.tsv')
          .respond("a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9");

        dsv.tsv.getRows('test.tsv').success(function(data) {
          expect(data).toEqual([
            ["a","b","c"],
            ["1", "2","3"],
            ["4", "5", "6"],
            ["7", "8", "9"]
          ]);
        });

        $httpBackend.flush();

      })

      it('should accept a config object and accessor function', function(done) {

        $httpBackend.expectGET('test.tsv')
          .respond("a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9");

        dsv.tsv.getRows('test.tsv',{}, function(d) { return { values: d }; }).success(function(data) {
          expect(data).toEqual([
            { values: ["a","b","c"] },
            { values: ["1", "2","3"] },
            { values: ["4", "5", "6"] },
            { values: ["7", "8", "9"] }
          ]);
        });

        $httpBackend.flush();

      })

      it('config object should be optional', function(done) {

        $httpBackend.expectGET('test.tsv')
          .respond("a\tb\tc\n1\t2\t3\n4\t5\t6\n7\t8\t9");

        dsv.tsv.getRows('test.tsv', function(d) { return { values: d }; }).success(function(data) {
          expect(data).toEqual([
            { values: ["a","b","c"] },
            { values: ["1", "2","3"] },
            { values: ["4", "5", "6"] },
            { values: ["7", "8", "9"] }
          ]);
        });

        $httpBackend.flush();

      })
    });

    describe('#parse', function() {
      it('returns an array of objects', function() {
        expect(dsv.tsv.parse("a\tb\tc\n1\t2\t3\n")).toEqual([{a: "1", b: "2", c: "3"}]);
      })

      it('parses quoted values', function() {
        expect(dsv.tsv.parse("a\tb\tc\n1\t\"he,l\tlo\"\t3\n")).toEqual([{a: "1", b: "he,l\tlo", c: "3"}]);
      })

      it('parses unix newlines', function() {
        expect(dsv.tsv.parse("a\tb\tc\n1\t2\t3\n4\t5\t\"6\"\n7\t8\t9")).toEqual([
          {a: "1", b: "2", c: "3"},
          {a: "4", b: "5", c: "6"},
          {a: "7", b: "8", c: "9"}
        ]);
      });

      it('parses mac newlines', function() {
        expect(dsv.tsv.parse("a\tb\tc\r1\t2\t3\r4\t5\t\"6\"\r7\t8\t9")).toEqual([
          {a: "1", b: "2", c: "3"},
          {a: "4", b: "5", c: "6"},
          {a: "7", b: "8", c: "9"}
        ]);
      });

      it('parses dos newlines', function() {
        expect(dsv.tsv.parse("a\tb\tc\r\n1\t2\t3\r\n4\t5\t\"6\"\r\n7\t8\t9")).toEqual([
          {a: "1", b: "2", c: "3"},
          {a: "4", b: "5", c: "6"},
          {a: "7", b: "8", c: "9"}
        ]);
      });
    })

    describe('#parseRows', function() {

      it('returns an array of arrays', function() {
        expect(dsv.tsv.parseRows("a\tb\tc\n1\t2\t3\n4\t5\t\"6\"\n7\t8\t9")).toEqual([
          ["a","b","c"],
          ["1", "2","3"],
          ["4", "5", "6"],
          ["7", "8", "9"]
        ]);
      });

    })
  })



});
