module.exports = {
	getDB : function () {
		return db;
	},

	getUserModel : function(){
		return userModel;
	}
}

var mongoose = require('mongoose')

var local_url = 'mongodb://localhost/splitwise'
var url_db = local_url

if(process.env.MONGO_URL !== undefined) {
    url_db = process.env.MONGO_URL
} else if(process.env.SCALINGO_MONGO_URL !== undefined) {
    url_db = process.env.SCALINGO_MONGO_URL
}

mongoose.connect(url_db, { server: { poolSize: 1 }});


var db = mongoose.connection;

//Schemas
var Schema = mongoose.Schema;

var contactSchema = new Schema({
 	name: String,
  	email: String,
  	number: String
  },
  {collection : 'splitwise' }
);

var UserSchema  = new Schema({
	clientID: Number,
	username: String,
	lastName: String,
	firstName: String,
	email: String,
	password: String,
	token: String
})
var contactModel = mongoose.model('contact', contactSchema);
var userModel = mongoose.model('user', UserSchema);

