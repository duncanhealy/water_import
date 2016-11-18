'use strict';
var fs = require('fs');
fs.createReadStream('process.env')
  .pipe(fs.createWriteStream('.env'));