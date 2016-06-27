angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.passageData = {};
	$scope.passages = []
	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function() {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.addPassage = function() {

	$http.get('http://192.168.1.118:3000/passages')
		.then(function (response) {
		
			var data = {'id': (response.data.length+1), 'title': $scope.passageData.title, 'text': $scope.passageData.text,
		 		'mastered': 0, 'current passage': 0, 'reviewed':0}

		 	console.log('Adding passage', data);
			$http.post("http://localhost:3000/passages", data)
		})
		.catch(function (err) {
			console.error('Problem getting passages');

			throw err;
		})
		;

		
		
		
		$scope.closeLogin();
		
	};
})

.controller('passagesCtrl', function($scope, $http) {
	
	$http.get('http://192.168.1.118:3000/passages')
		.then(function (response) {
			console.log(response);
			$scope.passages = response.data;
		})
		.catch(function (err) {
			console.error('Problem getting passages');

			throw err;
		})
		;

})

.controller('passageCtrl', function($scope, $stateParams, $http) {
	$http.get('http://192.168.1.118:3000/passages/'+$stateParams.passageId)
		.then(function (response) {
			console.log(response);
			$scope.passage = response.data;
		})
		.catch(function (err) {
			console.error('Problem getting passages');

			throw err;
		})
		;
});
