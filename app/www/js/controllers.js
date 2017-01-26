angular.module('starter.controllers', [])

.controller('menuCtrl', function($scope) {
    var userID = localStorage.getItem('userID');
    var username = localStorage.getItem('username');

    $scope.user = { 'userID': userID, 'username': username };
})

.controller('addCtrl', function($scope, $state, $http) {

    // Form data for the passage adding modal
    $scope.passageData = {};
    $scope.passages = []

    // Perform the add passage action when the user submits the form
    $scope.addPassage = function() {

        $http.get('/passages')
            .then(function(response) {

                var data = {
                    'id': (response.data.length + 1),
                    'title': $scope.passageData.title,
                    'text': $scope.passageData.text,
                    'mastered': 0,
                    'currentPassage': 0,
                    'reviewed': 0
                }

                console.log('Adding passage', data);
                $http.post("/passages", data)
                    .then(function(response) {
                        $state.go("app.passages");
                    })
            })
            .catch(function(err) {
                console.error('Problem getting passages');

                throw err;
            });


    };
})

.controller('settingsCtrl', function($scope, $state, $window, $http) {
    $scope.data = {};

    $http.get('/passages')
        .then(function(response) {

            $scope.passages = response.data;
        })
        .catch(function(err) {
            console.error('Problem getting passages');
            throw err;
        });


    $scope.changePassage = function() {

        $http.patch('/setCurrentPassage/' + $scope.data.newCurrentPassage)
            .then(function(response) {
                $state.go('app.passages')
            });

    };
})

.controller('gameStartCtrl', function($scope, $state, $http) {
    $scope.playGame = function() {
        $http.get('/passages')
            .then(function(response) {

                var passages = response.data;
                for (var i = 0; i < passages.length; i++) {
                    var passage = passages[i]
                    if (passage.currentPassage == true) {
                        $state.go('app.game', { 'passageId': passage.id });
                    }
                }
            })
            .catch(function(err) {
                console.error('Problem getting passages');
                throw err;
            });
    }

    $scope.review = function() {
        $http.get('/passages')
            .then(function(response) {

                var passages = response.data;
                var minReviewed = { 'times': passages[0].reviewed, 'passageId': passages[0].id }
                for (var i = 0; i < passages.length; i++) {
                    var passage = passages[i]
                    if (passage.reviewed < minReviewed) {
                        minReviewed.times = passage.reviewed;
                        minReviewed.passageId = passage.id;
                    }
                }
                $state.go('app.game', { 'passageId': minReviewed.passageId });
            })
            .catch(function(err) {
                console.error('Problem getting passages');
                throw err;
            });
    }

})

.controller('gameCtrl', function($scope, $stateParams, $window, $http) {
    $scope.removePunctuation = function(s) {
        var punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        return punctuationless.replace(/\s{2,}/g, " ");
    }

    $scope.passage = {};
    $scope.game = {};
    $scope.words = [];
    $scope.data = {};
    $http.get('/passages/' + $stateParams.passageId)
        .then(function(response) {

            $scope.passage = response.data;
            $scope.words = $scope.passage.text.split(" ");
            var randomIndex = Math.floor((Math.random() * ($scope.words.length - 1)) + 1);
            $scope.game.text = $scope.words.slice(0, randomIndex).join(" "); //All words up to a random index
            $scope.game.correctAnswer = $scope.removePunctuation($scope.words[randomIndex]).toLowerCase();
        })
        .catch(function(err) {
            console.error('Problem getting passages');
            throw err;
        });

    $scope.nextQuestion = function() {
        var randomIndex = Math.floor((Math.random() * ($scope.words.length - 1)) + 1);
        $scope.game.text = $scope.words.slice(0, randomIndex).join(" "); //All words up to a random index
        $scope.game.correctAnswer = $scope.removePunctuation($scope.words[randomIndex]);
        $scope.data.answer = null;
        if ($scope.passage.mastered == false) {
            var change = { "reviewed": $scope.passage.reviewed + 1 };
            $scope.passage.reviewed++;
        }
        $http.patch('/passages/' + $scope.passage.id, change);

    }
})


.controller('passagesCtrl', function($scope, $http) {
    $http.get('/passages')
        .then(function(response) {
            $scope.passages = response.data;
        })
        .catch(function(err) {
            console.error('Problem getting passages');
            throw err;
        });
})

.controller('passageCtrl', function($scope, $stateParams, $state, $http, $ionicPopup) {
    $http.get('/passages/' + $stateParams.passageId)
        .then(function(response) {
            $scope.passage = response.data;
        })
        .catch(function(err) {
            console.error('Problem getting passages');

            throw err;
        });

    $scope.review = function() {
        $state.go('app.game', { 'passageId': $scope.passage.id });
    };

    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Are you sure?',
            template: `Do you really want to delete ${$scope.passage.title}?  This cannot be undone.`
        });

        confirmPopup.then(function(res) {
            if (res) {
                console.log('Deleting...');
                $http.delete('/passages/' + $stateParams.passageId)
                    .then(function(response) {
                        $state.go("app.passages");
                    })
                    .catch(function(err) {
                        console.error('Problem deleting passage');
                        throw err;
                    });

            } else {
                console.log('Delete cancelled');
            }
        });
    };
});