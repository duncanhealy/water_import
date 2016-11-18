var EJSON = require('mongodb-extended-json');
var BSON = require('bson');
var XLSX = require('xlsx');
const xlsTypes = {exceed:"exceed", result:"result", summary:"summary", scheme:"scheme", shortfall:"shortfall", compliance:"compliance", supply:"supply", numberofsamples:"numberofsamples",numberofchecksamples:"numberofchecksamples", none:""};
const nullstring = "";
const folderSep = "\\";

 function groupBy(items,propertyName)
{
    var result = [];
    $.each(items, function(index, item) {
       if ($.inArray(item[propertyName], result)==-1) {
          result.push(item[propertyName]);
       }
    });
    return result;
}

function stripName(name){


}
function showTable(filename){
  var CvTb = require("convert-table");
  CvTb({
    input: filename,
    table: {
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
        , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
        , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
        , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    }
  }, function(table){
    table.show() // call show method to show up the table
  });

}

function loadXLSX(filename) {
var workbook = XLSX.readFile(filename);
var sheet_name_list = workbook.SheetNames;
/*
sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for(z in worksheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0,tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if(!data[row]) data[row]={};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    return data;
});
*/
return sheet_name_list;
}
     // List all files in a directory in Node.js recursively in a synchronous fashion
     var walkSync = function(dir, filelist) {
            var path = path || require('path');
            var fs = fs || require('fs'),
            files = fs.readdirSync(dir);
            filelist = filelist || {};
   
            files.forEach(function(file) {
                if (dir === "node_modules") {

                } else if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    filelist = walkSync(path.join(dir, file), filelist);
                }
                else {
                    // Array push
                    // filelist.push(path.join(dir, file));
                    // JSON elem
                    //"List of Exceedances"
                    //Summary
                    //"Monitoring Results"
                    //"Scheme Details" 1 miss mayo! Scheme fixes
                    //"Monitoring Shortfall" 2 miss
                    let $ =    path.join(dir, file);
                    let posSlash = ($.indexOf(folderSep));
                    let posSp = ($.indexOf(" "));
                    let pos2ndSlash = (posSlash>0)?($.substring(posSlash+1, $.length-posSlash).indexOf(folderSep)):-1;
                    let ext = path.extname($);
                    // load if ext matches


                   // let county = filename.
                   //console.log ($);
                   //console.log ($.substring(posSlash+1, $.length-posSlash));
                   //console.log (pos2ndSlash);
                   //console.log (posSp);
                   //return {};

                    let props = {};
                    props["type"] = nullstring;
                    props["year"] = (posSlash>0)?($.substring(0, posSlash)):nullstring;
                    props["county"]= ((pos2ndSlash>0)?$.substring(posSlash+1, posSlash+1+pos2ndSlash):(posSp >0)?($.substring(posSlash+1,posSp)):nullstring);
                    if(ext === ".xlsx"){
                        //console.log($);
                        props.xls = loadXLSX($);
                        //console.log(props.xls);
                        
                    } 
                    if(ext === ".csv"){
                       // showTable($);
                    }
                    if(ext === ".xls"){

                    }
                    //props['1\\']=posSlash;
                    //props['2\\']=pos2ndSlash;
                    //props['1 ']=posSp;

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
                    switch (true){
                        case ($.indexOf("Exceedance")>0||$.indexOf("Exceedence")>0):
                            props["type"] += xlsTypes.exceed;
                            break;
                        case ($.indexOf("Monitoring Results")>0):
                            props["type"] += xlsTypes.result;
                            break;
                        case ($.indexOf("Summary")>0):
                            props["type"] += xlsTypes.summary;
                            break;
                        case ($.indexOf("Shortfall")>0):
                            props["type"] += xlsTypes.shortfall;
                            break;
                        case ($.indexOf("Scheme")>0):
                            props["type"]+=xlsTypes.scheme;
                            break;
                        case ($.indexOf("Compliance")>0):
                            props["type"]+=xlsTypes.compliance;
                            break;    
                        case ($.indexOf("Supply")>0)||($.indexOf("Supplies")>0):
                            props["type"]+= xlsTypes.supply;
                            break;
                        case ($.indexOf("No. Of Samples")>0) || ($.indexOf("No of Samples")>0) || ($.indexOf("No. of Samples")>0):
                            props["type"]+= xlsTypes.numberofsamples;
                            break;  
                        case ($.indexOf("NOOFCH")>0):
                            props["type"]+= xlsTypes.numberofchecksamples;
                            break;  
                        default:
                            props["type"]+=xlsTypes.none;
                    }
       
                    filelist[$]=props;
                }
            });
            return filelist;
        };
let _flist = {};

        walkSync("./2015", _flist);
         
//console.log( EJSON.stringify(_flist));
console.log( _flist);
//        console.log(_flist.length)

        