var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog");

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	email: String
		// title:  String,
		// author: String,
		// body:   String,
		// comments: [{ body: String, date: Date }],
		// date: { type: Date, default: Date.now },
		// hidden: Boolean,
		// meta: {
		//   votes: Number,
		//   favs:  Number
		// }
});
var userModel = mongoose.model('user', userSchema);
var userEntity = new userModel({
	username: 'admin',
	password: 'admin',
	email: 'csadsa@126.com'
});
// userEntity.save(function(err) {
//     if (err) {
//         console.log('保存失败')
//         return;
//     }
//     console.log('meow');
// });
//打印这个实体的名字看看
// console.log(userEntity.username); //Krouky
var musicSchema = new Schema({
	collectionname: String,
	collectionid: Number,
	collectiontext: String,
	song: [{
		songid: Number,
		songname: String,
		url: String,
		author: String
	}]

});
var musicModel = mongoose.model('music', musicSchema);


exports.connect = function(request, response) {
	mongoose.connect("mongodb://localhost:27017/blog", function(e) {
		if (e) response.send(e.message);
		response.send("connect yes!");
	});
}
exports.con = function() {
	console.log(userEntity.password);
	// response.send("connect yes!");
}

exports.usersave = function(unm, upd, uem) {
	var newuser = new userModel({
		username: unm,
		password: upd,
		email: uem
	});
	newuser.save(callback);
}


exports.userfind = function(unm, cb) {
		console.log(unm + "test");
		var query = userModel.findOne({
			'username': unm
		});
		query.exec(function(err, user) {
			if (err) return handleError(err);
			console.log(user);
			console.log('%s %s is a %s.', user.username, user.password, user.email); // Space Ghost is a talk show host.
			cb(null, user);
			// cb(null, user);
		});

		// return userModel.findOne({
		// 	'username': unm
		// },function(err, user) {
		// 	if (err) return handleError(err);
		// 	console.log('%s %s is a %s.', user.username, user.password, user.email); // Space Ghost is a talk show host.
		// 	// cb(null, user);
		// });
	}
	//专辑查询
exports.mcfind = function(unm, cb) {
	var query = musicModel.findOne({
		'collectionname': unm
	});
	query.exec(function(err, ret) {
		if (err) return handleError(err);
		console.log(ret.song);
		//console.log('%s %s is a %s.', ret.retname, ret.password, ret.email); // Space Ghost is a talk show host.
		cb(null, ret);
		// cb(null, user);
	});
}

var commentSchema = new Schema({
	commentid: Number,
	commentpreid: Number,
	commenttext: String,
	commentuser: String,
	commentsong: Number,
});
var commentModel = mongoose.model('comment', commentSchema);
//根据音乐id找所对应的评论，返回json
exports.csongfind = function(snm, cb){
	var query = commentModel.find({
		commentsong: snm
	});
	query.exec(function(err, ret) {
		if (err) return handleError(err);
		cb(null, ret);
	});
}


var Todo = mongoose.model('text', {
	text: String
});

exports.find = function(cb) {
	var query = Todo.find({

	});
	query.exec(function(err, ret) {
		if (err) return handleError(err);
		//console.log(ret.song);
		//console.log('%s %s is a %s.', ret.retname, ret.password, ret.email); // Space Ghost is a talk show host.
		cb(null, ret);
		// cb(null, user);
	});
}

exports.create = function(num, cb) {
	var newc = new Todo({
		text: num.text,
	});
	newc.save(function(err) {
	    if (err) {
	        console.log('保存失败')
	        return;
	    }
	    console.log('meow');
	});
}