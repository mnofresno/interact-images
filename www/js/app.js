// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('interact-images', ['ionic', 'ngCordova', 'ngLodash', 'LocalStorageModule', 'interact-images.controllers', 'interact-images.services', 'interact-images.directives'])

.run(function($ionicPlatform, ImagePicker) {
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

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    
  localStorageServiceProvider.setPrefix('interact-images');
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/layout.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.addpictures', {
      url: '/addpictures',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/addpictures.html',
          controller: 'AddPicturesCtrl',
          controllerAs: 'addpics'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  
  .state('app.categories', {
    url: '/categories',
    cache: false,
    views: {
        'menuContent':{
            templateUrl: 'templates/categories.html',
            controller: 'CategoriesCtrl',
            controllerAs: 'categories'
        }
    }
  })

  .state('app.pictures', {
    url: '/pictures/:categoryId',
    cache: false,
    views: {
        'menuContent':{
            templateUrl: 'templates/pictures.html',
            controller: 'PicturesCtrl',
            controllerAs: 'pictures'
        }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
