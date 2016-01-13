var db = require('database.js');

exports.create = function(req, res) {
	var depenses = req.body;

	if (depenses == null || depenses.sheet_id == null || depenses.name == null 
		|| depenses.name.trim().length == 0 || depenses.paid_by == null
		|| depenses.paid_by.length == 0 || depenses.iou == null
		|| depenses.iou.length == 0 || depenses.amount == null
		|| depenses.date == null) {

		return res.send(400);
	}

	var depenses_realiser = new db.DepensesModel();
	depenses_realiser.sheet_id = depenses.sheet_id;
	depenses_realiser.name = depenses.name.trim();
	depenses_realiser.date = depenses.date;
	depenses_realiser.amount = depenses.amount;
	depenses_realiser.paid_by = depenses.paid_by;
	depenses_realiser.iou = depenses.iou;

	depenses_realiser.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, depenses_realiser);
	});
}

exports.lireToutSheet = function(req, res) {
	var sheet_id = req.params.sheet_id;

	if (sheet_id == null) {
		return res.send(400);
	}

	var query = db.DepensesModel.find({sheet_id: sheet_id});
	query.sort('-date');
	query.exec(function(err, depensess) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, depensess);
	});
}

exports.lire = function(req, res) {
	var sheet_id = req.params.sheet_id;
	var depenses_id = req.params.id;

	if (sheet_id == null || friend_id == null) {
		return res.send(400);
	}

	var query = db.DepensesModel.findOne({sheet_id: sheet_id, _id: depenses_id});
	query.exec(function(err, depenses) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200, depenses);
	});
}

exports.update = function(req, res) {
	return res.send(400, "Not implemented yet");
}

exports.delete = function(req, res) {
	var sheet_id = req.params.sheet_id;
	var depenses_id = req.params.id;

	if (sheet_id == null || depenses_id == null) {
		return res.send(400);
	}

	var query = db.DepensesModel.findOne({sheet_id: sheet_id, _id: depenses_id});
	query.exec(function(err, depenses) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		if (depenses != null) {
			depenses.remove();
			return res.send(200);
		} else {
			return res.send(400);
		}
	});
}