(function ( define ) {
  "use strict";

  define([

  ],
  function (

  ){

    var RouteManager = function ( $stateProvider, $urlRouterProvider, $locationProvider ){

          $locationProvider.html5Mode(true);

          // states
          $stateProvider
            .state('index', {
              url: "/",
              templateUrl: "views/index.html",
              controller  : function($scope, $famous, States, $http){
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

                $http.get('./models/index.json').then(function(res){
                  $scope.vignettes = res.data;
                  console.log($scope.vignettes);
                });

              }
            });
          // end states
    };

    return ["$stateProvider", "$urlRouterProvider", "$locationProvider", RouteManager ];
  });

}( define ));