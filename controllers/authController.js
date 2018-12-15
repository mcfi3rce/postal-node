/****************************************************************
 * Login Functionality
 ****************************************************************/
const userModel = require("../models/userModel.js");
// We are going to use sessions
var session = require('express-session');

// Checks if the username and password match a hardcoded set
// If they do, put the username on the session
function handleLogin(request, response) {
	var result = {success: false};
    if (request.body.lg_username && request.body.lg_password){
		var username = request.body.lg_username;	
    	var password = request.body.lg_password;
		console.log("success!");
	}
	else{
		return "error!";
	}
    
	// We should do better error checking here to make sure the parameters are present
    userModel.getUserFromDb(username, password, function(error, result){
		if(error){
			console.error(error);
			throw error;
		}
		
		if (result.username == username && result.password == password) {
            request.session.user = username;
            result = {success: true};
            response.render('pages/index', result);
        }
    });
	
}

// If a user is currently stored on the session, removes it
function handleLogout(request, response) {
	var result = {success: false};
	
	console.log("Logout!", request.session.user);
	
	// We should do better error checking here to make sure the parameters are present
	if (request.session.user) {
		request.session.destroy();
		result = {success: true};
	}

	response.json(result);
}

module.exports = {
	handleLogin: handleLogin,
    handleLogout: handleLogout,
};
