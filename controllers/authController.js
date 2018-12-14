/****************************************************************
 * Login Functionality
 ****************************************************************/
// Checks if the username and password match a hardcoded set
// If they do, put the username on the session
function handleLogin(request, response) {
	var result = {success: false};
    
	// We should do better error checking here to make sure the parameters are present
	if (request.body.lg_username == "admin" && request.body.lg_password == "password") {
		request.session.user = request.body.username;
		result = {success: true};
	}

//	response.json(result);
}

// If a user is currently stored on the session, removes it
function handleLogout(request, response) {
	var result = {success: false};

	// We should do better error checking here to make sure the parameters are present
	if (request.session.user) {
		request.session.destroy();
		result = {success: true};
	}

	response.json(result);
}