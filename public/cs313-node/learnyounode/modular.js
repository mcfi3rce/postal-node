var mymodule = require('./filtermodule.js');

var folder = process.argv[2];
var ext = process.argv[3];
var callback = function(err, files){
    if (err) return console.error(err);
    files.forEach(function(file){
        console.log(file);
    });
};

var filtered = mymodule(folder,ext, callback);

/* Solution 
var filterFn = require('./solution_filter.js')
var dir = process.argv[2]
var filterStr = process.argv[3]

filterFn(dir, filterStr, function (err, list) {
  if (err) {
    return console.error('There was an error:', err)
  }

  list.forEach(function (file) {
    console.log(file)
  })
})
*/
