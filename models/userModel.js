/********************************************************************
* DATABASE REQUESTS
* This section has all the calls to the database for the data that is * needed. 
*********************************************************************/
// Connect to the db
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://mcfi3rce:safe@localhost:5432/booklife";

// Establish the connection
const pool = new Pool({connectionString: connectionString});


// Get the User data, in this case we will spoof the login for now
// This function gets books
function getUserFromDb (username, password, callback) {
	console.log("Accessing User Data");
    console.log("Values to be bound", username, password);
	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	var sql = "SELECT username, password, email FROM public.user WHERE username = $1::text AND password = $2::text";
    
    // this gets the current user
    params = [username, password];
    
	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err || result == null || result.rows.length != 1) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows[0]);
	});

}  // end of getBooksFromDb

module.exports = {
	getUserFromDb: getUserFromDb
};
