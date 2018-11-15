const http = require('http');
const url = require('url');

const port = 8081;

http.createServer(function onRequest(request, response){
    
    let requestUrl = url.parse(request.url, true);
    
    if (requestUrl.pathname === '/home') {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        
        response.write('<h1>Welcome Home!</h1>');
    }
    else if (requestUrl.pathname === '/getData') {
        response.writeHead(200, {'Content-Type' : 'application/json'});
        
        response.write(JSON.stringify({
            'name' : 'Br. Burton',
            'class' : 'CS313'
        }));
    }
    else if (requestUrl.pathname === '/times') {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        
        response.write('<h1>Welcome Home!</h1>');
    }
    else{
        response.writeHead(404, {'Content-Type' : 'text/html'});
        
        response.write('<h1>404 Page Not Found!</h1>');
    }
    
    response.end();
}).listen(port, () => {
    console.log(`Now listening on port ${port}`);
});