/********************************************************************
* DATABASE REQUESTS
* This section has all the calls to the database for the data that is * needed. 
*********************************************************************/
// Connect to the db
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://mcfi3rce:safe@localhost:5432/booklife";

// Establish the connection
const pool = new Pool({connectionString: connectionString});

function searchBooksInDB(search, callback) {
	console.log("Searching books from DB");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "SELECT id, title, author, publisher, isbn, cover_art from public.book WHERE title LIKE '%" + search + "%'";
    
	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		// console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}  // end of getBooksFromDb

function getAllBooksFromDB(callback) {
	console.log("Getting all books from DB");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = `SELECT id,
                    title, 
                    author, 
                    publisher,
                    isbn,
                    cover_art 
                    from public.book`;
    
	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		// console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}  // end of getAllBooksFromDB

function getBookById(bookId, callback) {
	console.log("Getting by ID");

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = `SELECT id,
                    title, 
                    author, 
                    publisher,
                    isbn,
                    cover_art 
                    from public.book
                    WHERE id = $1::int`;
    
	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
    
    params = [bookId];
    
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		// console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}  // end of getAllBooksFromDB



module.exports = {
	searchBooksInDB: searchBooksInDB,
    getAllBooksFromDB: getAllBooksFromDB,
    getBookById: getBookById
};
