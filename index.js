/********************************************************************
* SERVER SETUP
* This is all the setup necessary to get the server up and running.
*********************************************************************/
const PORT = process.env.PORT || 5000;
const path = require('path');
var express = require('express'),
    app = express();

const bodyParser = require('body-parser');
// We are going to use sessions
var session = require('express-session')

// Connect to the controllers
const bookController = require("./controllers/bookController.js");
const reviewController = require("./controllers/reviewController.js");

// Connect to docker container
//var client = require('./connection.js');

// set the view engine to ejs
app
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(session({
        secret: 'my-super-secret-secret!',
        resave: false,
        saveUninitialized: true
    }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
    .use(verifyLogin);


// This is a middleware function that we can use with any request
// to make sure the user is logged in.
function verifyLogin(request, response, next) {
	if (request.session.user) {
		// They are logged in!
		// pass things along to the next function
		next();
	} else {
		// They are not logged in
		// Send back an unauthorized status
		var result = {succes:false, message: "Access Denied"};
		response.status(401).json(result);
	}
}

// This middleware function simply logs the current request to the server
function logRequest(request, response, next) {
	console.log("Received a request for: " + request.url);

	// don't forget to call next() to allow the next parts of the pipeline to function
	next();
}

/********************************************************************
* DATABASE REQUESTS
* This section has all the calls to the database for the data that is * needed. 
*********************************************************************/

// This function handles requests to the /login endpoint
function getUser(request, response) {
	// This is the original user
    var id = 1;
    
	getUserFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got the books and send a response back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: "Incorrect Login Info"});
		} else {
			var user = result [0];
            response.json(user);
		}
	});
}

// Get the User data, in this case we will spoof the login for now
// This function gets books
function getUserFromDb (id, callback) {
	console.log("Accessing User Data");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "SELECT username, password, email FROM public.user WHERE id = $1::int";
    
    // this gets the current user
    params = [id];
    
	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}  // end of getBooksFromDb

app.post('/data', (request, response) => {
    editComment(1, 1, request, response);
});

/********************************************************************
* ENDPOINTS
* This section has all the endpoints that are being exposed, so far I * have the books, the user info, and the reviews
*********************************************************************/
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

app.get('/post', function(req, res) {
    res.render('pages/post');
});

// Setup our routes
app.post('/login', handleLogin);
app.post('/logout', handleLogout);


// list all books in the database
app.get('/books', bookController.getBooks);
app.get('/book', bookController.searchBooks);
app.get('/info', bookController.bookInfo);

// authentication
app.get('/login', function(req, res) {
    getUser(req, res);
});

// see reviews
app.get('/review', reviewController.getReviews);
app.post('/createReview', reviewController.createReview);


/********************************************************************
* PONDER PROVE 09
* This section is what I used to calculate package cost.
*********************************************************************/
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

