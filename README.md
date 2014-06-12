# angular-dsv
delimter-seperated-values

A simple angularjs service for reading text files of tabular data (for example tab-delimited and comma-delimited).  angular-dsv combines the convience of the [d3 csv/tsv module](https://github.com/mbostock/d3/wiki/CSV) with angular's [$http](https://docs.angularjs.org/api/ng/service/$http) service.

## Install
1. `bower install angular-dsv` or `bower install Hypercubed/angular-dsv`
2. Include the `angular-dsv.js` into your app.  By default should be at `bower_components/angular-marked/angular-dsv.js`.
4. Add `hc.dsv` as a module dependency to your app.

## Usage

### dsv(delimiter)

The dsv service takes a single argument and returns a new `$http`-like service for handling text files of `delimiter`-seperated values.  `dsv.tsv` and `dsv.csv` are  shortcuts for `dsv('\t')` and `dsv(',')` respectivly.

### dsv.tsv(config[, accessor])

The `dsv.tsv` service is an example of 'delimiter'-seperated value interface for tab-delimited tables.  It is function which takes two arguments: a configuration object like that expected by angular's [$http](https://docs.angularjs.org/api/ng/service/$http), and an optional accessor function for transforming each row of the tabular data file.  Like `$http` `dsv.tsv` returns a promise with two "`$http` specific methods": `.success` and `.error` (in addition to `.then`)

```(js)
  dsv.tsv({method: 'GET', url: '/someUrl'}, function(d) { return {key: d.key, value: +d.value}; })
    .success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
    })
    .error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
```

The data value is array of objects representing the parsed rows returned from the specified url.  The first row of the returned data is used as column names; these column names become the attributes on the returned objects. For example if the http request returns:

```
Year  Make     Model  Length
1997  Ford     E350   2.34
2000  Mercury  Cougar 2.38
```

The resulting JavaScript array is:

```
[
  {"Year": "1997", "Make": "Ford", "Model": "E350", "Length": "2.34"},
  {"Year": "2000", "Make": "Mercury", "Model": "Cougar", "Length": "2.38"}
]
```

#### dsv.tsv.get(url\[, config]\[, accessor])

Like `$http` `dsv.tsv` provides a shortcut method for HTTP GET:

```(js)
dsv.tsv.get('/someUrl', accessorFunction).success(successCallback);
```

#### dsv.tsv.getRows(url\[, config]\[, accessor])

Similar to the `dsv.tsv.get` shortcut except the returned value is an array of arrays and the header line is treated as a standard row. For example if the http request returns:

```
Year  Make     Model  Length
1997  Ford     E350   2.34
2000  Mercury  Cougar 2.38
```

The resulting JavaScript array is:

```
[
  ["Year", "Make", "Model", "Length"],
  ["1997", "Ford", "E350", "2.34"],
  ["2000", "Mercury", "Cougar", "2.38"]
]
```

### dsv.csv

Like `dsv.tsv` except for comma-seperated-values.

## Testing

Install npm and bower dependencies:

```bash
	npm install
	bower install
	npm test
```

## Acknowledgments

Portions of this code were taken from mbostock's [d3 csv/tsv module](https://github.com/mbostock/d3/wiki/CSV)

## License
MIT
