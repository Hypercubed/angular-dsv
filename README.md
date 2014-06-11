# angular-dsv
delimter-seperated-values

A simple angularjs service for reading delimter-seperated-values (for example tab-delimited and comma-delimited) from text files.

## Install
1. `bower install angular-dsv` or `bower install Hypercubed/angular-dsv`
2. Include the `angular-dsv.js` into your app.  By default should be at `bower_components/angular-marked/angular-dsv.js`.
4. Add `hc.dsv` as a module dependency to your app.

## Usage

### dsv(delimiter)

The dsv service takes a single argument and returns a new service for handling 'delimiter'-seperated values.  dsv.tsv and dsv.csv are special shortcuts for dsv('\t') and dsv(',') respectivly.

### dsv.tsv(config)

The dsv.tsv service is and example of 'delimiter'-seperated value interface.  It is function which takes two arguments: a configuration object like that expected by `$http`, and an optional accessor function for transforming each row of teh tabular data file.  Like `$http` `dsv.tsv` returns a promise with two ""$http specific methods": success and error.

```(js)
  dsv.tsv({method: 'GET', url: '/someUrl'}).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
    }).error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
```

## Testing

Install npm and bower dependencies:

```bash
	npm install
	bower install
	npm test
```

## Why?

## Acknowledgments

Portions of this code were taken from mbostock's [d3 csv/tsv module](https://github.com/mbostock/d3/wiki/CSV)

## License
MIT
