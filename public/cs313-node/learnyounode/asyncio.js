
var fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    if (err) return console.error(err);
    var lines = data.toString().split("\n").length;
    if (lines > 0) lines -= 1;
    console.log(lines);
});