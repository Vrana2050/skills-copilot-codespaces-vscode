// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
var server = http.createServer(function(request, response) {
  // Get URL
  var parsedUrl = url.parse(request.url);
  var resource = parsedUrl.pathname;
  console.log('resource = ' + resource);

  // Remove slash from resource
  if (resource == '/') {
    resource = '/index.html';
  }

  // Read HTML file
  var resourcePath = __dirname + resource;
  console.log('resourcePath = ' + resourcePath);
  if (resource.indexOf('/comment') == 0) {
    // Process POST method
    if (request.method == 'POST') {
      var body = '';
      request.on('data', function(data) {
        body += data;
      });

      request.on('end', function() {
        var post = qs.parse(body);
        var comment = post.comment;
        console.log('comment = ' + comment);

        // Save comment
        fs.appendFile('comment.txt', comment + '\n', 'utf8', function(err) {
          response.writeHead(302, {
            'Location': '/comment.html'
          });
          response.end();
        });
      });
    }
  } else {
    fs.readFile(resourcePath, 'utf-8', function(error, data) {
      if (error) {
        response.writeHead(404, {
          'Content-Type': 'text/html'
        });
        response.write('<h1>404 Not Found</h1>');
        response.end();
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
      }
    });
  }
});

// Start web server
server.listen(3000, function() {
  console.log('Server is running!');
});