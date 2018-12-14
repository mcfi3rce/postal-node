const reviewModel = require("../models/reviewModel.js");

function getReviews(request, response) {
	// This will be set to the user eventually
    
    bookId = request.query.bookId;
    
	reviewModel.getReviewsFromDB(bookId, function(error, result) {
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

function editReview(request, response) {
	// This will be set to the user eventually
    
    const text = request.body.data;
    const user_id = request.body.id;
    const book_id = request.body.book_id
    console.log(text);
    
	reviewModel.updateReview(text, id, book_id, function(error, result) {
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

function createReview(request, response){
    
//    const user_id = request.body.user_id;
    const book_id = request.body.book_id;
    const title = request.body.title;
    const rating = request.body.rating;
    const review = request.body.review;
    const would_recommend = request.body.recommend;
    
//    console.log(user_id);
    console.log(book_id);
    console.log(title);
    console.log(rating);
    console.log(review);
    console.log(would_recommend);
    
}

module.exports = {
	getReviews: getReviews,
    editReview: editReview,
    createReview: createReview
};
