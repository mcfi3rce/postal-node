// server.js
// load the things we need
const PORT = process.env.PORT || 5000;
var express = require('express'),
    app = express();

// set the view engine to ejs
app
    .use(express.static(path.join(__dirname, 'public'))),   
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    var drinks = [
        { name: 'Water', gainz: 0 },
        { name: 'Protein', gainz: 5 },
        { name: 'Raw Eggs', gainz: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.get('/package', function(req, res) {
    res.render('pages/form');
});

app.get('/total', function(req, res) {
    var weight = Number(req.query.weight);
    var mailType = req.query.package;
    var total = computePostage(weight, mailType, loadTotal);
    
    function letters(weight, isStamped){
        var total = Math.floor(weight);
        var base = 0.0;
        
        if (isStamped){
            base = .5;
        }
        else{
            base = .47;
        }
        
        if (weight == total){
            total = total - 1;
            total = base + (total * .21);
        }
        else if (weight > 3){
            if (isStamped){
                total = 1.13;
            }
            else{
                total = 1.10;
            }
        }
        else{
            total = base + (total * .21);
        }
        return total;
    }
    
    function flatEnvelope(weight){
        total = Math.floor(weight);
        if (weight == total){
            total = total - 1;
            total = (total * .21) + 1;
        }
        else{
            total = (total * .21) + 1;        
        }
        return total;
    }
    
     function package(weight){
        if (weight <= 4){
            return 3.5
        }
        else if (weight <= 8){
            return 3.75;
        }
        else if (weight <= 13){
            return 4.1 + ((Math.floor(weight) % 9) * .35); 
        }
        else{
            return 5.5;
        }
    }
    
    function computePostage(weight, mailType, callback){
        var total = 0.0;
        switch (mailType){
            case "Letters (Stamped)":
                total = letters(weight, true);
                break;
            case "Letters (Metered)":
                total = letters(weight, false);
                break;
            case "Large Envelopes (Flats)":
                total = flatEnvelope(weight);
                break;
            case "First-Class Package Service—Retail":
                total = package(weight);
                break;
            default:
                console.log("error");
                break;
        }
        callback(weight, mailType, total);
    }
    
    function loadTotal(weight, mailType, total){
        
        var params = {weight: weight, mailType: mailType, total:total};
        res.render('pages/total', params);
    }
    
    
});
