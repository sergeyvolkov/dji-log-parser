# dji-log-parser  
DJI Flight Records parser.

Original repository: [mikeemoo/dji-log-parser](https://github.com/mikeemoo/dji-log-parser).  
Has been added:
 - ES6 Classes
 
In progress:
 - cli utility
 - documentation

### Documentation
Check `./lib/model/*.js` files to see available methods.

### Example
```ecmascript 6
'use strict';

const fs = require('fs');
const { promisify } = require('util');

const DJIParser = require('./lib');

const parser = new DJIParser();

parser.once('OSD', (obj) => {
  console.log('Initial coordinates:', obj.getLatitude(), obj.getLongitude());
});

parser.once('DETAILS', obj => {
  console.log('Total distance: ', obj.getTotalDistance());
});

(async () => {
  const readFileAsync = promisify(fs.readFile);

  let buffer;
  try {
    buffer = await readFileAsync('path_to_your_file');
  }
  catch (err) {
    console.error('Something went wrong with file reading:', err);
    process.exit(1);
  }

  parser.parse(buffer);
})();

```
