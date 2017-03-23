var EJSON = require('mongodb-extended-json')
var fs = require('fs')
var parse = require('csv-parse')
var async = require('async')
// var RegExp = require('RegExp')
if (!RegExp.escape) {
  RegExp.escape = (S) => {
    // 1. let str be ToString(S).
    // 2. ReturnIfAbrupt(str).
    let str = String(S)
    // 3. Let cpList be a List containing in order the code
    // points as defined in 6.1.4 of str, starting at the first element of str.
    let cpList = Array.from(str[Symbol.iterator]())
    // 4. let cuList be a new List
    let cuList = []
    // 5. For each code point c in cpList in List order, do:
    for (let c of cpList) {
      // i. If c is a SyntaxCharacter then do:
      if ('^$\\.*+?()[]{}|'.indexOf(c) !== -1) {
        // a. Append "\" to cuList.
        cuList.push('\\')
      }
      // Append c to cpList.
      cuList.push(c)
    }
    // 6. Let L be a String whose elements are, in order, the elements of cuList.
    let L = cuList.join('')
    // 7. Return L.
    return L
  }
}
var convertjson = require('convert-json')
const xlsTypes = { exceed: 'exceed', result: 'result', summary: 'summary', scheme: 'scheme', shortfall: 'shortfall', compliance: 'compliance', supply: 'supply', numberofsamples: 'numberofsamples', numberofchecksamples: 'numberofchecksamples', none: '' }
const nullstring = ''
const folderSep = '\/'
let uniquearray = []
let checkparam = process.argv[2]
if (typeof (checkparam) === 'undefined') {
  checkparam = 'Parameter'
}

console.log('Checking for ' + checkparam)
/*
function checkfile(filename){
  return fs.open(filename, 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('myfile already exists')
        return
      } else {
        throw err
      }
    }
})
     // fs.createWriteStream(filename, {flags: 'a'})

}
*/

// var stream = checkfile(checkparam + 'txt')

Array.prototype.add = function (elem) {
  if (this.indexOf(elem) === -1) {
    this.push(elem)
  }
}
/*
Array.prototype.unique = function () {
  let _ = {}
  let i
  let l = this.length
  let r = []
  for (i = 0; i < l; i += 1) {
    _[this[i]] = null
  }
  for (i in _) {
    r.push(_[i])
  }
  return r
}
*/
function parseCSV ($, workbook, param) {
  var _returnxml = {}
  var parser = parse({ delimiter: ',' }, function (error, data) {
    async.eachSeries(data, function (line, callback) {
      // do something with the line
      _returnxml[line] = data(line).then(function () {
        // when processing finishes invoke the callback to move to the next one
        callback()
      })
    })
    if (error) {
      console.error($ + ':parsecsv:' + error)
    }
  })
  fs.createReadStream($).pipe(parser)
}
function parseX ($, workbook, param) {
    // var sheet = workbook.Sheets[0];\
  if (typeof (workbook) === 'undefined') {
    console.error('undefined workbook' + $)
    return
  }
  var sheetnamelist = workbook.SheetNames
  var _xmlreturn = {}
  if (typeof (sheetnamelist) === 'undefined') {
    console.error('undefined sheetnamelist' + $)
    return
  }
  sheetnamelist.forEach(function (y) {
    var worksheet = workbook.Sheets[y]
    var headers = {}
    var data = []
    for (let z in worksheet) {
      if (z[0] === '!') continue
            // parse out the column, row, and value
      var tt = 0
      for (var i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
          tt = i
          break
        }
      };
      var col = z.substring(0, tt)
      var row = parseInt(z.substring(tt))
      var value = worksheet[z].v

            // store header names
      if (row === 1 && value) {
        // uniquearray.add(value)
        headers[col] = value
        continue
      }

      if (!data[row]) data[row] = {}
      if (headers[col] === param) {
        uniquearray.add(value)
        // data[row][headers[col]] = value
      }
    }
        // drop those first two rows which are empty
    data.shift()
    data.shift()
    if (typeof (y) !== 'undefined') {
      if (data.length > 0) {
            //    console.log(_xmlreturn);
       // _xmlreturn[y] = data
      }
            // console.log(data.length);
    }
  })
  // console.log (uniquearray)
  return [] // _xmlreturn
}

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function (dir, filelist) {
  var path = require('path')
  var fs = require('fs')
  var files = fs.readdirSync(dir)
  filelist = filelist || {}

  files.forEach(function (file) {
    if (dir === 'node_modules') {

    } else if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist)
    } else {
            // Array push
            // filelist.push(path.join(dir, file));
            // JSON elem
            // "List of Exceedances"
            // Summary
            // "Monitoring Results"
            // "Scheme Details" 1 miss mayo! Scheme fixes
            // "Monitoring Shortfall" 2 miss
      var $ = path.join(dir, file)
      let posSlash = ($.indexOf(folderSep))
      let posSp = ($.indexOf(' '))
      let pos2ndSlash = (posSlash > 0) ? ($.substring(posSlash + 1, $.length - posSlash).indexOf(folderSep)) : -1
      let ext = path.extname($)
            // load if ext matches

            // let county = filename.
            // console.log ($);
            // console.log ($.substring(posSlash+1, $.length-posSlash));
            // console.log (pos2ndSlash);
            // console.log (posSp);
            // return {};

      let props = {}
      props['type'] = nullstring
      props['year'] = (posSlash > 0) ? ($.substring(0, posSlash)) : nullstring
      props['county'] = ((pos2ndSlash > 0) ? $.substring(posSlash + 1, posSlash + 1 + pos2ndSlash) : (posSp > 0) ? ($.substring(posSlash + 1, posSp)) : nullstring)
            // props['1\\']=posSlash;
            // props['2\\']=pos2ndSlash;
            // props['1 ']=posSp;

            // Dun - dun laoighaire
            // DLR
            // City vs County
            // \\ contained take the left
            // 2013
            // Data_2013
            // CSV
            // Fingal
            // Bray
            // Drogheda
            // Clonmel

            // South - South Dublin
            // North - North Tipperary
      switch (true) {
        case ($.indexOf('Exceedance') > 0 || $.indexOf('Exceedence') > 0):
          props['type'] += xlsTypes.exceed
          break
        case ($.indexOf('Monitoring Results') > 0):
          props['type'] += xlsTypes.result
          break
        case ($.indexOf('Summary') > 0):
          props['type'] += xlsTypes.summary
          break
        case ($.indexOf('Shortfall') > 0):
          props['type'] += xlsTypes.shortfall
          break
        case ($.indexOf('Scheme') > 0):
          props['type'] += xlsTypes.scheme
          break
        case ($.indexOf('Compliance') > 0):
          props['type'] += xlsTypes.compliance
          break
        case ($.indexOf('Supply') > 0) || ($.indexOf('Supplies') > 0):
          props['type'] += xlsTypes.supply
          break
        case ($.indexOf('No. Of Samples') > 0) || ($.indexOf('No of Samples') > 0) || ($.indexOf('No. of Samples') > 0):
          props['type'] += xlsTypes.numberofsamples
          break
        case ($.indexOf('NOOFCH') > 0):
          props['type'] += xlsTypes.numberofchecksamples
          break
        default:
          props['type'] += xlsTypes.none
      }
      // if (props['type'] === xlsTypes.result) {
      if (ext === '.xlsx') {
                  // console.log($);
        // if (props['county'] === 'Wicklow') {
        convertjson.xlsx(($), function (error, result) {
          if (error) {
            console.error($ + ':xlsx:' + error)
          } else {
            props.xls = parseX($, result, checkparam)
          }
        })
          // console.log(props.xls)
        // }

                  // })

                  //   props.xls = showTable($);
                  // } else {
                  //    props.xls ="{}";
                  // }

                  // console.log(props.xls);
      }
      if (ext === '.csv') {
        convertjson.csv($, function (error, result) {
          if (error) {
            console.error($ + ':csv:' + error)
          } else {
            console.error($ + ':csv:notprocessed')
            // props.xls = parseCSV($, result, checkparam)
          }
          //          console.log(result);
        })
      }
      if (ext === '.xls') {
        convertjson.xls(($), function (error, result) {
          if (error) {
            console.error($ + ':xls:' + error)
          } else {
            props.xls = parseX($, result, checkparam)
          }

                      // props.xls = result;
                      // console.log(result)
        })
      }
    // }

      filelist[$] = props
    }
  })
  return filelist
}
let _flist = {}

walkSync('./2015', _flist)

function escapemystring (str) {
  return RegExp.escape(str)
//  return str.replace(/\\/g, '\\\\').replace(/\$/g, '\\$').replace(/'/g, '\\'').replace(/"/g, '\\\"')
}
var wstream = fs.createWriteStream('_' + checkparam.toLowerCase() + '.js')

wstream.on('error', function (err) { console.error(err) /* error handling */ })
wstream.write('let ' + checkparam.toLowerCase() + ' = [')
uniquearray.forEach(function (v) { wstream.write('\'' + escapemystring(v) + '\',\n') })
wstream.write('\'EOF\']\n')
wstream.write('module.exports = ' + checkparam.toLowerCase() + '\n')
wstream.end()

// console.log(EJSON.stringify(_flist))

// console.log( _flist);
//        console.log(_flist.length)
