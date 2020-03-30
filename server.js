var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404 (response){
    response.writehead(404, {'content-Type':'text/plain'});
    response.write('error 404:resource not found.');
    response.end();
}

function sendfile (response, filePath, fileContents){
    response.writehead(200, {"content-type" :mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serverStatic (response, cache, absPath){
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath])
    }
    else{
        fs.exists(absPath, function(exists) {
            if(exists){
                fs.readFile (absPath, function(err, data){
                    if(err){
                        send404(response);
                    }
                    else{
                        cache[absPath]=data;
                        sendfile(response, absPath, data);
                    }
                });
            }
            else{
                send404(response);
            }
        });
    }
}

var server = http.createServer(function(Request, response){
    var filePath = false;
    if(Request.url== '/'){
        filePath= 'public/index.html';
    }
    else{
        filePath= 'public' + Request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen (3000, function(){
console.log("server listening on port 3000.");
}
);

