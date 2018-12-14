/********************************************************************
* DATABASE REQUESTS
* This section has all the calls to the database for the data that is * needed. 
*********************************************************************/
// Connect to the db
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://mcfi3rce:safe@localhost:5432/booklife";

// Establish the connection
const pool = new Pool({connectionString: connectionString});

// This function gets reviews for a particular book
function getReviewsFromDB(bookId, callback) {
	console.log("Getting reviews from DB with ID:", bookId);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = `SELECT display_name, 
                    book_id, 
                    title, 
                    rating, 
                    review,would_recommend 
                from public.books_read as b
                INNER JOIN public.user as p
                ON b.user_id = p.id
                WHERE book_id = $1::int`;
    
    // this gets the book that has been selected user
    params = [bookId];
    
    console.log("Binding Query", sql);
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
		console.log("Found review result: ", result.rows);

		callback(null, result.rows);
	});

}  // end of getBooksFromDb

// This function updates a review if the user wants to edit it
function updateReview(text, id, book_id, callback) {
	console.log("Updating review in DB");

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
		console.log("Found review result: ", result.rows);

		callback(null, result.rows);
	});

}

// This function gets reviews for a particular book
function createReviewInDb(user_id, book_id, title, rating, review, would_recommend,callback) {
	console.log("Getting reviews from DB with ID:", bookId);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = `INSERT INTO public.books_read 
                            (user_id, 
                            book_id, 
                            title, 
                            rating, 
                            review,     
                            would_recommend) 
                VALUES ($1::int, $2::int, $3::text, $4::int, $5::text, $6::tinyint);`;
    
    // this gets the book that has been selected user
    params = [user_id, book_id, title, rating, review, would_reccomend];
    
    console.log("Binding Query", sql);
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
		console.log("Successful");

		callback(null, {"succes": "true"});
	});

}  // end of getBooksFromDb


module.exports = {
	getReviewsFromDB: getReviewsFromDB,
    updateReview: updateReview,
    createReviewInDb: createReviewInDb
};
