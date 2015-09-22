var app = angular.module('MusicFM', [], function(){});
	app.controller('music',function($scope , $timeout){
		var currentIndex = 0;
		$scope.currentTime = $scope.duration = '0';
		$scope.songname = $scope.author = $scope.album = '0';

		$scope.audio = document.createElement('audio');
		var audio = $scope.audio;
		
		setInfo();
		audio.volume = 0.5;

		// listener
		audio.oncanplay = function(){
			setTime();
		}
		audio.onended = function(){
			next();
		}
		setInterval(function() {
			setTime();
		}, 1000);
		
		//action
		$scope.mute = function(){
			audio.muted = !audio.muted;
		}
		next = function(){
			goNext();  
			audio.load();
			setTime();
			audio.play();
		}
		play = function(){
			if ( audio.paused ) audio.play();
			else audio.pause();
			$scope.$apply();
		}
		setprogress = function(event,element){
			var per = getPercentage(event,element);
			
			audio.currentTime = audio.duration*per;
			setTime();
		}
		setvolume = function(event,element){
			var per = getPercentage(event,element);
			$scope.$apply(function(){
				audio.volume = per;
				audio.muted = false;
			});
		}
		
		function goNext(){
			currentIndex++;
			if ( currentIndex==playlist.length )
				currentIndex -= playlist.length;
			setInfo();
		}
		function getPercentage(event,element){
			return ((event.clientX-element.getBoundingClientRect().left)/
					element.clientWidth).toFixed(4);
		}
		function setTime(){
			if ( !isNaN(audio.currentTime) ) 
					$scope.currentTime = changeToTime(audio.currentTime);
			if ( !isNaN(audio.duration) ) 
				$scope.duration = changeToTime(audio.duration);
			$scope.$apply();
		}
		//alert( changeToTime(23.3) );
		function changeToTime(time){
			var a,b;
			a = parseInt(time/60); b = parseInt(time-a*60);
			//if ( a<10 ) a = '0'+a; 
			if ( b<10 ) b = '0'+b; 
			return a+':'+b;
		}
		function setInfo(){
			//alert(playlist.length);
			$scope.songname = playlist[currentIndex].name;
			$scope.author = playlist[currentIndex].author;
			audio.src = playlist[currentIndex].url;
		}
    });