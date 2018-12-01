/********************************************************************
* SERVER SETUP
* This is all the setup necessary to get the server up and running.
*********************************************************************/
const PORT = process.env.PORT || 5000;
const path = require('path');
var express = require('express'),
    app = express();

const bodyParser = require('body-parser');

// set the view engine to ejs
app
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.urlencoded({ extended: false }))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

/********************************************************************
* DATABASE REQUESTS
* This section has all the calls to the database for the data that is * needed. 
*********************************************************************/
// Connect to the db
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://mcfi3rce:safe@localhost:5432/booklife";

// Establish the connection
const pool = new Pool({connectionString: connectionString});

// This function handles requests to the /books endpoint
function getBooks(request, response) {
	// This will be set to the user eventually
    var search = request.query.search
    
	getBooksFromDb(search, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got the books and send a response back
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			response.json(result);
		}
	});
}

// This function gets books
function getBooksFromDb(search, callback) {
	console.log("Getting books from DB");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "SELECT * from public.book WHERE title LIKE '%" + search + "%'";
    
    // we will use this later for filtering
    params = null;
    
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
            response.status(200).json(user);
            return user;
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

// This function gets reviews for a particular book
function getReviewsFromDb(id, callback) {
	console.log("Getting reviews from DB");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "SELECT * from public.books_read WHERE book_id = $1::int";
    
    // this gets the book that has been selected user
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
		console.log("Found review result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}  // end of getBooksFromDb

function getReviews(request, response) {
	// This will be set to the user eventually
    var id = 1;
    
	getReviewsFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got the books and send a response back
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
            response.json(result);
		}
	});
}
// This function gets reviews for a particular book
function updateReview(text, id, book_id, callback) {
	console.log("Getting reviews from DB");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "UPDATE public.books_read SET review = $1::text WHERE user_id = $2::int AND book_id = $3::int;";
    
    // this gets the book that has been selected user
    params = [text, id, book_id];
    
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
		console.log("Found review result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}  // end of getBooksFromDb

function editComment(id, book_id, request, response) {
	// This will be set to the user eventually
    const text = request.body.data;
    console.log(text);
    
	updateReview(text, id, book_id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got the books and send a response back
		if (error || result == null) {
			response.status(500).json({success: false, data: error});
		} else {
			var reviews = result.rows;
            response.status(200).json(reviews);
            return JSON.stringify(reviews);
		}
	});
    
}

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


// list all books in the database
app.get('/books', function(req, res) {
    console.log(req.query.search);
    getBooks(req, res);
});

// authentication
app.get('/login', function(req, res) {
    var user = getUser(req, res);
    console.log("Returned: " + user);
});

// see reviews
app.get('/review', function(req, res) {
    getReviews(req, res);
});

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
