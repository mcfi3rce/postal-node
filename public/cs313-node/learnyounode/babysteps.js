var values = process.argv;
var numbers = values.slice(2);
var sum = 0;
numbers.forEach(function(element) {
    var integer = Number(element);
    sum += integer;
});

console.log(sum);