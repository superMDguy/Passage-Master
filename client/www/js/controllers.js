angular.module('starter.controllers', [])

.controller('addCtrl', function($scope, $state, $window, $http) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the passage adding modal
	$scope.passageData = {};
	$scope.passages = []


	// Perform the add passage action when the user submits the form
	$scope.addPassage = function() {

		$http.get('http://192.168.1.118:3000/passages')
			.then(function (response) {
			
				var data = {'id': (response.data.length+1), 'title': $scope.passageData.title, 'text': $scope.passageData.text,
			 		'mastered': 0, 'currentPassage': 0, 'reviewed':0}

			 	console.log('Adding passage', data);
				$http.post("http://localhost:3000/passages", data)
			})
			.catch(function (err) {
				console.error('Problem getting passages');

				throw err;
			})
			;

			$state.go("app.passages");
			$window.location.reload()		
		};
})

.controller('settingsCtrl', function($scope, $state, $window, $http) {
	$scope.data = {};

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


	$scope.changePassage = function() {
		change = {"currentPassage": 1}
		$http.patch('http://localhost:3000/passages/'+$scope.data.newCurrentPassage, change).then(function(response) {
			console.log(response);
			$state.go("app.passages");
			$window.location.reload()
		})
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
