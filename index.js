var express = require('express');
var path = require('path');
var connections = require('./connections.json');
var strips = require('./strips.json');
var app = express(); //module.exports = express.createServer();



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/imgs')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.set('view engine', 'ejs');
app.get('/',function(req,res){
	res.render('pages/index')
});

app.get('/strips', function(req,res){
	res.json(strips);
});

app.get('/connections', function(req,res){
	res.json(connections);
})





var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});