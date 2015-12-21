var application_root = __dirname,
    express = require('express'),
    path = require('path'),
	bodyParser  = require('body-parser'),
	mongoose = require('mongoose');



var database = require('./database')
var app = express() ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(path.join(application_root ,'../client'), { maxAge: oneDay }));
app.use(express.static(path.join(application_root ,'../client')));

var db = database.getDB()
var contatModel = database.getContactModel()
//mongoose.connect('mongodb://localhost/splitwise', { server: { poolSize: 1 }});
/*mongoose.model('contacts',{
 	name: String,
  	email: String,
  	number: String,
  	{ collection : 'splitwise' }

})
*/
app.get('/contactlist' ,function(res, res){
	console.log('I received a GET request');

	contatModel.find(function(req, contacts){
		console.log(contacts);
		res.send(contacts);
	});
})

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	//Start server
	var port = 8755;
	app.listen(port, function () {
		'use strict';
		console.log('Express server listening on port %d in %s mode', port, app.settings.env);
		console.log('application_root is %s',path.join(application_root ,'./client'));
	});
})

