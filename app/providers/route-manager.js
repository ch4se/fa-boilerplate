(function ( define ) {
  "use strict";

  define([
    'famous/scrollHandler'
  ],
  function (
    ScrollHandler
  ){

    //var contentLoaded = new Event('contentLoaded');
    //contentLoaded.initEvent('contentLoaded', true, true);

    var RouteManager = function ( $stateProvider, $urlRouterProvider, $locationProvider ){

          $locationProvider.html5Mode(true);

          // states
          $stateProvider
            .state('index', {
              url: "/",
              templateUrl: "views/index.html",
              controller  : function($rootScope, $scope, $famous, States, $http){
                var Engine = $famous['famous/core/Engine'];
                var EventHandler = $famous['famous/core/EventHandler'];
                var Transitionable = $famous['famous/transitions/Transitionable'];
                var Timer = $famous['famous/utilities/Timer'];

                $scope.scrollHandler = new EventHandler();
                Engine.pipe($scope.scrollHandler);

                $scope.scrollOptions = {
                  paginated: false,
                  speedLimit: 2,
                  direction: 1,
                  clipSize: window.innerHeight
                };

                $scope.transitions = {
                    opacity: new Transitionable(0),
                    position: new Transitionable([0,0,0])
                };

                $scope.textures = ['assets/black-slate.jpg',
                                   'assets/the-wonders-of-the-natural-world.jpg',
                                   'assets/crashing-1992-light-by-steve-belovarich.jpg',
                                   'assets/into-the-void-by-steve-belovarich.jpg',
                                   'assets/what-dreams-are-made-of-by-steve-belovarich.jpg',
                                   'assets/Where-The-Subconscious-Meets-Conscious-Thought-by-Steve-Belovarich.jpg',
                                   'assets/playing-with-fire-by-steve-belovarich.jpg',
                                   'assets/flair-by-steve-belovarich.jpg'];

                $http.get('./models/index.json').then(function(res){
                  $scope.vignettes = res.data;
                  //$rootScope.$broadcast('contentLoaded');
                  //window.dispatchEvent(contentLoaded);
                  //console.log($scope.vignettes);
                });

                $http.get('./models/synth.json').then(function(res){
                  $scope.synth = res.data;
                  //console.log($scope.synth);
                });

              }
            });

          $stateProvider
            .state('photo', {
              url: "/photography",
              templateUrl: "views/photo-portfolio/photo.html",
              controller  : function($rootScope, $scope, $famous, States, $http){
                var Engine = $famous['famous/core/Engine'];
                var EventHandler = $famous['famous/core/EventHandler'];
                var Transitionable = $famous['famous/transitions/Transitionable'];
                var Timer = $famous['famous/utilities/Timer'];

                $scope.scroller = new ScrollHandler({
                  direction:'y',
                  min:-400,
                  max:0
                });
                console.log($scope.scroller);
                $scope.scrollHandler = $scope.scroller.sync;
                Engine.pipe($scope.scrollHandler);



                $scope.scrollOptions = {
                  paginated: false,
                  speedLimit: 2,
                  direction: 1,
                  clipSize: window.innerHeight
                };


                $scope.textures = ['assets/black-slate.jpg',
                                   'assets/black-slate.jpg'];

                $http.get('./models/photo-portfolio.json').then(function(res){
                  $scope.vignettes = res.data;
                });

                $http.get('./models/500px.json').then(function(res){

                  $scope.photos = res.data;
                  $scope.collection = $scope.photos.collections[2].photos;

                });


              }
            });

          $stateProvider
            .state('tunnel', {
              url: "/tunnel",
              templateUrl: "views/tunnel/tunnel.html",
              controller  : function($rootScope, $scope, $famous, States, $http){


                $scope.textures = ['assets/Where-The-Subconscious-Meets-Conscious-Thought-by-Steve-Belovarich.jpg',
                                   'assets/the-wonders-of-the-natural-world.jpg',
                                   'assets/crashing-1992-light-by-steve-belovarich.jpg',
                                   'assets/into-the-void-by-steve-belovarich.jpg',
                                   'assets/what-dreams-are-made-of-by-steve-belovarich.jpg',
                                   'assets/Where-The-Subconscious-Meets-Conscious-Thought-by-Steve-Belovarich.jpg',
                                   'assets/playing-with-fire-by-steve-belovarich.jpg',
                                   'assets/flair-by-steve-belovarich.jpg'];

                $http.get('./models/self-obsession.json').then(function(res){
                  $scope.vignettes = res.data;
                });


              }
            });

          $stateProvider
            .state('landscape', {
              url: "/landscape",
              templateUrl: "views/landmass/landmass.html",
              controller  : function($rootScope, $scope, $famous, States, $http){


                $scope.textures = ['assets/the-wonders-of-the-natural-world.jpg',
                                   'assets/the-wonders-of-the-natural-world.jpg',
                                   'assets/crashing-1992-light-by-steve-belovarich.jpg',
                                   'assets/into-the-void-by-steve-belovarich.jpg',
                                   'assets/what-dreams-are-made-of-by-steve-belovarich.jpg',
                                   'assets/Where-The-Subconscious-Meets-Conscious-Thought-by-Steve-Belovarich.jpg',
                                   'assets/playing-with-fire-by-steve-belovarich.jpg',
                                   'assets/flair-by-steve-belovarich.jpg'];
              }
            });

          // end states
    };

    return ["$stateProvider", "$urlRouterProvider", "$locationProvider", RouteManager ];
  });

}( define ));