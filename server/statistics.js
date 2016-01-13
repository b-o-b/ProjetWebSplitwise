var db = require('database.js');
var Async = require('async');

exports.read = function(req, res) {

	Async.parallel([
		function (callback) {
			db.DashboardsModel.count({}, function (err, count) {
				if (err) {
					callback(err);
				}

				callback(null, count);
			});
		},

		function (callback) {
			db.AmisModel.count({}, function (err, count) {
				if (err) {
					callback(err);
				}

				callback(null, count);
			});
		},

		function (callback) {
			db.DepensesModel.count({}, function (err, count) {
				if (err) {
					callback(err);
				}

				callback(null, count);
			});
		}
	],

	function(err, results) {
		if (err) {
			return res.send(400);
		}
		//results = [countDashboards, countAmis, countDepenses];
		return res.send(200, {Dashboards: results[0], Amis: results[1], Depenses: results[2]});
	});
};