var connect = require('connect');
var serveStatic = require('serve-static');
var port = 3000;
console.log('Please open: http://localhost:' + port + "/" );
//connect().use(serveStatic('bower_components')).listen( 3000 );
var app = connect();
app.use(serveStatic('www'));
app.use(serveStatic('bower_components'));
app.listen( 3000 );

