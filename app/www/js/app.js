angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('app.gameStart', {
    url: '/gameStart',
    views: {
      'menuContent': {
        templateUrl: 'templates/gameStart.html',
        controller: 'gameStartCtrl'
      }
    }
  })

  .state('app.game', {
    url: '/game/:passageId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playGame.html',
        controller: 'gameCtrl'
      }
    }
  })

  .state('app.addPassage', {
      url: '/addPassage',
      views: {
        'menuContent': {
          templateUrl: 'templates/addPassage.html',
          controller: 'addCtrl'
        }
      }
    })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
        }
      }
    })

    .state('app.passages', {
      url: '/passages',
      views: {
        'menuContent': {
          templateUrl: 'templates/passages.html',
          controller: 'passagesCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/passages/:passageId',
    views: {
      'menuContent': {
        templateUrl: 'templates/passage.html',
        controller: 'passageCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/passages');
});
