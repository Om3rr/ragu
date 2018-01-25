app = angular.module('gameApp', ['ngMaterial']).config(function($sceProvider) {
	$sceProvider.enabled(false);
});;
$http = angular.injector(["ng"]).get("$http");

app.run(function ($rootScope, $mdDialog) {
	$rootScope.getStrips = function(){
		return $http.get('/strips')
	};

	$rootScope.getConnections = function(){
		return $http.get('/connections')
	}
});