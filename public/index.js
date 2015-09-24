var playlist = [{
	'url': "music/media/你是我心内的一首歌.mp3",
	'songname': "你是我心中的一首歌",
	'author': "王力宏"
}, {
	'url': "music/media/100次.mp3",
	'songname': '100次',
	'author': '幼稚园杀手'
}, {
	'url': "music/media/匆匆那年.mp3",
	'songname': "匆匆那年",
	'author': "王菲"
}, {
	'url': "music/media/快乐的结局.mp3",
	'songname': "My Happy Ending",
	'author': "Avril Lavigne"
}, {
	'url': "music/media/生活颂.mp3",
	'songname': "生活颂",
	'author': "幼稚园杀手"
}, {
	'url': "music/media/天涯过客.mp3",
	'songname': "天涯过客",
	'author': "周杰伦"
}, {
	'url': "music/media/意识流 III.mp3",
	'songname': "意识流 III",
	'author': "幼稚园杀手"
}];
var currentIndex = 0;
var app = angular.module('MusicFM', [], function() {});
console.log("index.js ok");
app.factory('Data', function() {
	return {
		cur: 0
	}
});
app.controller('music', function($scope, $timeout, $http, Data) {

	$scope.currentTime = $scope.duration = '0';
	$scope.songname = $scope.author = $scope.album = '0';

	$scope.audio = document.createElement('audio');
	$scope.data = Data;
	var audio = $scope.audio;
	var albumname = "";
	$http({
		method: 'GET',
		url: '/json'
	}).success(function(response, status, headers, config) {
		console.log(response);
		playlist = response.song;
		albumname = response.collectionname;
		console.log(playlist);
		setInfo();
	});

	// setInfo();

	audio.volume = 0.5;

	// listener
	audio.oncanplay = function() {
		setTime();
	}
	audio.onended = function() {
		next();
	}
	setInterval(function() {
		setTime();
	}, 1000);

	//action
	$scope.mute = function() {
		audio.muted = !audio.muted;
	}

	$scope.setCur = function() {
		Data.cur = currentIndex + 1;
	}
	next = function() {
		goNext();
		audio.load();
		setTime();
		audio.play();
	}
	play = function() {
		if (audio.paused) audio.play();
		else audio.pause();
		$scope.$apply();
	}
	setprogress = function(event, element) {
		var per = getPercentage(event, element);

		audio.currentTime = audio.duration * per;
		setTime();
	}
	setvolume = function(event, element) {
		var per = getPercentage(event, element);
		$scope.$apply(function() {
			audio.volume = per;
			audio.muted = false;
		});
	}

	function goNext() {
		currentIndex++;
		if (currentIndex == playlist.length)
			currentIndex -= playlist.length;
		setInfo();
	}

	function getPercentage(event, element) {
		return ((event.clientX - element.getBoundingClientRect().left) /
			element.clientWidth).toFixed(4);
	}

	function setTime() {
		if (!isNaN(audio.currentTime))
			$scope.currentTime = changeToTime(audio.currentTime);
		if (!isNaN(audio.duration))
			$scope.duration = changeToTime(audio.duration);
		$scope.$apply();
	}
	//alert( changeToTime(23.3) );
	function changeToTime(time) {
		var a, b;
		a = parseInt(time / 60);
		b = parseInt(time - a * 60);
		//if ( a<10 ) a = '0'+a; 
		if (b < 10) b = '0' + b;
		return a + ':' + b;
	}

	function setInfo() {
		//alert(playlist.length);
		$scope.songname = playlist[currentIndex].songname;
		$scope.author = playlist[currentIndex].author;
		$scope.album = albumname;
		$scope.descriptions = playlist[currentIndex].descriptions;
		// $scope.currentIndex = currentIndex + 1;
		// share.setVal(currentIndex);
		$scope.setCur();
		audio.src = playlist[currentIndex].url;
	}



});

var commentlist = [{
	"commentid": 1,
	"commentpreid": 1,
	"commenttext": "aaaaa",
	"commentuser": "fasdf",
	"commentsong": 1
}, {
	"commentid": 1,
	"commentpreid": -1,
	"commenttext": "test1",
	"commentuser": "admin",
	"commentsong": 1
}, {
	"commentid": 2,
	"commentpreid": -1,
	"commenttext": "test3",
	"commentuser": "admin",
	"commentsong": 1
}, {
	"commentid": 1,
	"commentpreid": -1,
	"commenttext": "test2",
	"commentuser": "admin",
	"commentsong": 1
}];
var commentlist;

app.controller('comment', function($scope, $http, $timeout, Data) {
	$scope.data = Data;
	var maxcid = 0;
	$http({
		method: 'GET',
		url: '/com'
	}).success(function(response, status, headers, config) {
		//console.log(response);
		commentlist = response;
		console.log(commentlist);
		$scope.commentlist = commentlist;
		for (var i = 0; i < commentlist.length; i++) {
			if (maxcid < commentlist[i].commentid) {
				maxcid = commentlist[i].commentid;
			}
		}
		//setInfo();
	});

	// $scope.commentlist = commentlist;
	$scope.currentIndex = currentIndex;
	console.log(currentIndex);
	submit = function() {
		var formData = {
			"commentid": maxcid + 1,
			"commentpreid": -1,
			"commenttext": $scope.context,
			"commentuser": $scope.username,
			"commentsong": Data.cur
		}
		maxcid++;
		commentlist.push(formData);
		console.log(commentlist);
		$http.post('/addcomment', formData)
			.success(function(formData) {
				$scope.context = "";
				$scope.username = "";
				$scope.commentlist = formData;
				console.log(formData);
				$http({
					method: 'GET',
					url: '/com'
				}).success(function(response, status, headers, config) {
					//console.log(response);
					commentlist = response;
					console.log(commentlist);
					$scope.commentlist = commentlist;
					for (var i = 0; i < commentlist.length; i++) {
						if (maxcid < commentlist[i].commentid) {
							maxcid = commentlist[i].commentid;
						}
					}
					//setInfo();
				});
			});
		// $http.post('/api/todos', $scope.formData)
		//           .success(function(data) {
		//               $scope.formData = {}; // clear the form so our user is ready to enter another
		//               $scope.todos = data;
		//               console.log(data);
		//           })
		//           .error(function(data) {
		//               console.log('Error: ' + data);
		//           });
	}
})

app.controller('animation', function($scope, $http, $timeout) {
	left = function() {
		alert(" fasdf ");
	}
})