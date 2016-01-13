var db = require('database.js');
var Async = require('async');

exports.create = function(req, res) {
	var dashboardEntry = new db.dashboardsModel();
	dashboardEntry.name = 'My Shared dashboard';

	dashboardEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, {dashboard_id: dashboardEntry._id});
	});
}

/* Read from dashboards, amis and depenses */
exports.read = function(req, res) {
	var dashboard_id = req.params.id;
	if (dashboard_id == null) {
		return res.send(400);
	}

	Async.parallel([

		//Read dashboards data from dashboards
		function(callback) {
			var query = db.dashboardsModel.findOne({_id: dashboard_id});
			query.exec(function(err, dashboard) {
				if (err) {
		  			callback(err);
		  		}

		  		callback(null, dashboard);
		  	});
		},

		//Read amis data from amis
		function(callback) {
			var query = db.amisModel.find({dashboard_id: dashboard_id});
			query.exec(function(err, amis) {
				if (err) {
		  			callback(err);
		  		}

		  		callback(null, amis);
		  	});
		},

		//Read depenses data from depenses
		function(callback) {
			var query = db.depensesModel.find({dashboard_id: dashboard_id});
			query.sort('-date');
			query.exec(function(err, depenses) {
				if (err) {
		  			callback(err);
		  		}

		  		callback(null, depenses);
		  	});
		}
	],

	//Compute all results
	function(err, results) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		//results contains [dashboards, amis, depenses]
		var dashboardData = {_id: results[0]._id, name: results[0].name};
		dashboardData.amis = results[1] || [];
		dashboardData.depenses = results[2] || [];

		return res.send(200, dashboardData);
	});
}

exports.update = function(req, res) {
	var dashboard = req.body;
	
	if (dashboard == null || dashboard._id == null || dashboard.name == null
		|| dashboard.name.trim().length == 0) {

		return res.send(400);
	}

	updatedashboard = {name: dashboard.name.trim()};

	db.dashboardsModel.update({_id: dashboard._id}, updatedashboard, function(err, nbRows, raw) {
		if (err) {
			return res.send(400);
		}

		return res.send(200);
	});
}