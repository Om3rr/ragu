app.controller('gameCtrl', ['$scope', function ($scope) {
	$scope.categories = ["פוליטי", "גאוגרפי", "כלכלי", "חברתי", "תרבותי"];
	$scope.currentStrips = {};
	$scope.currentLock = '';
	$scope.connections = [];
	$scope.currConn = [];
	$scope.lights = [];
	$scope.faded = {};
	$scope.content = {};


	$scope.init = function(){
		var awaits = [$scope.getStrips(), $scope.getConnections()];
		Promise.all(awaits).then(function(data){
			$scope.strips = data[0].data;
			$scope.connections = data[1].data;
			$scope.shuffle();
		});
	};

	$scope.shuffle = function() {
		$scope.lights = [];
		_.forEach($scope.categories, function(cat){
			if(cat !== $scope.currentLock){
				$scope.currentStrips[cat] = $scope.getRandomStrip(cat)
			}
		});
		_.forEach($scope.categories, function(cat){
			_.forEach($scope.categories, function(cat2){
				if(cat === cat2) {
					return;
				}
				var conn = $scope.findConnection(cat, cat2);
				if(conn){
					$scope.currConn.push(conn);
					$scope.lights.push(cat);
					$scope.lights.push(cat2);
				}
			})
		});
		if($scope.lights.length > 0){
			console.log($scope.lights);
		}
		$scope.$apply()
	};


	$scope.getRandomStrip = function(category){
		var strips = _.filter($scope.strips, {category: category});
		return strips[_.random(0, strips.length-1)];
	};

	document.onkeypress = function(event){
		if(event.code === "Space"){
			$scope.faded = {};
			$scope.shuffle();
			$scope.$apply()
		}
	};

	$scope.changeLock = function(cat){
		$scope.currentLock = $scope.currentLock === cat ? '' : cat;
		document.body.click();
	};

	$scope.gotMatch = function(cat){
		return true;
	};


	$scope.findConnection = function(cat1, cat2) {
		var name1 = $scope.currentStrips[cat1].name;
		var name2 = $scope.currentStrips[cat2].name;
		return _.find($scope.connections, {key : [name2, name1]}) || _.find($scope.connections, {key : [name1, name2]});
	};

	$scope.isLightOn = function (cat) {
		return $scope.lights.indexOf(cat) > -1;
	};


	$scope.openConnection = function(category) {
		if(Object.values($scope.faded).indexOf(true) > -1){
			$scope.unfade();
			$scope.$apply();
			return;
		}
		debugger;
		var connect = _.find($scope.currConn, function(c){return c.key.indexOf($scope.currentStrips[category].name) > -1});
		var l = [];
		_.forEach(connect.key, function(key){
			var k = _.find($scope.strips, {name : key});
			l.push(k.category);
		});
		var fadeCount = 0;
		var fadedCategories = _.filter($scope.categories, function(cat){return l.indexOf(cat) === -1});
		_.forEach(fadedCategories, function(cat){
			$scope.faded[cat] = true;
			$scope.addConnectionContent(cat, connect, fadeCount);
			console.log($scope.content[cat]);
			fadeCount += 1;
		});
		$scope.$apply()
	};

	$scope.unfade = function(){
		$scope.faded = {};
		$scope.content = {};
	};

	$scope.fadeCategory = function (category) {
		return $scope.faded[category];
	};

	$scope.addConnectionContent = function(category, connection, count){
		switch(count){
			case 0:
				$scope.content[category] = {video : connection.video, picture : connection.picture};
				break;
			case 1:
				$scope.content[category] = {content : connection.content, href: connection.href};
				break;
			case 2:
				$scope.content[category] = {header : connection.title};
				break;
		}
	};

	$scope.init();
}]);