const bookModel = require("../models/bookModel.js");

// This function handles requests to the /books endpoint
function searchBooks(request, response) {
	// This will be set to the user eventually
    var search = request.query.search
    
    console.log("Searching: ", search);
    
	bookModel.searchBooksInDB(search, function(error, result) {
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

// This function handles requests to the /books endpoint
function getBooks(request, response) {
    
	bookModel.getAllBooksFromDB(function(error, result) {
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


// This function handles requests to the /books endpoint
function bookInfo(request, response) {
    
    bookId = request.query.bookId;
    
	bookModel.getBookById(bookId, function(error, result) {
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

module.exports = {
	searchBooks: searchBooks,
    getBooks: getBooks,
    bookInfo: bookInfo
};
