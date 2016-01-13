var db = require('database.js');
var Async = require('async');

exports.create = function(req, res) {
	var amis = req.body;

	if (amis == null || amis.dashboard_id == null || amis.name == null 
		|| amis.name.trim().length == 0) {
		return res.send(400);
	}

	var amisEntry = new db.AmisModel();
	amisEntry.dashboard_id = amis.dashboard_id;
	amisEntry.name = amis.name.trim();

	amisEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, amisEntry);
	});
}

exports.lireToutdashboard = function(req, res) {
	var dashboard_id = req.params.dashboard_id;

	if (dashboard_id == null) {
		return res.send(400);
	}

	var query = db.AmisModel.find({dashboard_id: dashboard_id});
	query.exec(function(err, amiss) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, amiss);
	});
}

exports.lire = function(req, res) {
	var dashboard_id = req.params.dashboard_id;
	var amis_id = req.params.id;

	if (dashboard_id == null || amis_id == null) {
		return res.send(400);
	}

	var query = db.AmisModel.findOne({dashboard_id: dashboard_id, _id: amis_id});
	query.exec(function(err, amis) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, amis);
	});
}

exports.update = function(req, res) {
	var amis = req.body;
	if (amis == null || amis.dashboard_id == null || amis._id == null
		|| amis.name == null || amis.name.trim().length == 0) {

		res.send(400);
	}

	updateamis = {name: amis.name.trim()};

	db.AmisModel.update({dashboard_id: amis.dashboard_id, _id: amis._id},
		updateamis,
		function(err, nbRows, raw) {
			if (err) {
				return res.send(400);
			}

			return res.send(200);
		}
	);
}

exports.delete = function(req, res) {
	var dashboard_id = req.params.dashboard_id;
	var amis_id = req.params.id;

	if (dashboard_id == null || amis_id == null) {
		return res.send(400);
	}

	Async.series(
		[
			//Remove amis
			function(callback) {
				var query = db.AmisModel.findOne({dashboard_id: dashboard_id, _id: amis_id});
				query.exec(function(err, amis) {
					if (err) {
						callback(err);
					}

					if (amis != null) {
						amis.remove();
						callback(null);
					} else {
						callback("amis not found");
					}
				});
			},

			//Remove depenses where amis = paye_par
			function(callback) {
				var query = db.DepensesModel.find({dashboard_id: dashboard_id, paid_by: amis_id});
				query.exec(function(err, depenses) {
					if (err) {
						callback(err);
					}

					if (depenses != null) {
						for (var i in depenses) {
							depenses[i].remove();
						}

						callback(null);
					} else {
						callback(null);
					}
				});
			},

			//Find depenses where amis is in paid_for, in order to remove it from paid_for and update depenses
			function(callback) {
				var query = db.DepensesModel.find({dashboard_id: dashboard_id, paid_for: amis_id});
				query.exec(function(err, depenses) {
					if (err) {
						callback(err);
					}

					if (depenses != null) {
						for (var i in depenses) {
							var indexInPaidFor = depenses[i].paid_for.indexOf(amis_id);
							if (indexInPaidFor > -1) {
								depenses[i].paid_for.splice(indexInPaidFor, 1);

								depenses[i].save(function(err) {
									if (err) {
										callback(err);
									}
								});
							}
						}

						callback(null);
					} else {
						callback(null);
					}
				});
			}
		],

		//Callback finale
		function(err, results) {
			if (err) {
				return res.send(400);
			}

			return res.send(200);
		}
	);
}