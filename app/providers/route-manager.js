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
              controller  : function($scope, $famous, States){
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

                $scope.model = {
                  sections:[{
                    headline:"Steve Belovarich",
                    subheadline:"Web Engineer / Maker / Digital Artist",
                    copy:""
                  },
                  {
                    headline:"Dependable Web Engineer",
                    subheadline:"Angular / Famo.us / jQuery / Wordpress",
                    copy:"Steve programs cutting edge HTML5 frameworks. He thinks responsive and can make your website look nice on multiple devices. Steve Belovarich is on GitHub, his CSS3 Ribbon Menu is an Editor's Pick on Codepen.io, and he was recently featured in Web Designer 199."
                  },
                  {
                    headline:"Steve Curates Dev Magnet",
                    subheadline:"A Flipboard magazine available at <a href='http://devmagnet.net'></a>.",
                    copy:""
                  },
                  {
                    headline:"Synth",
                    subheadline:"Steve created a video synthesizer for the web.",
                    copy:"Recently acquiring an initial round of funding on Kickstarter, Synth is a web app for creative coders to show off interactive visualizations."
                  },
                  {
                    headline:"Kinetic Light",
                    subheadline:"Solo exhibition of photography in LA",
                    copy:"Exhibition from March - July 2014 in Los Angeles was Steve's first solo exhbition of digital art. The exhbiit included original abstract digital photography and video art. Purchase <i>Kinetic Light</i> from the iBookstore and get the entire collection for display on all your devices."
                  }]
                };

              }
            });
          // end states
    };

    return ["$stateProvider", "$urlRouterProvider", "$locationProvider", RouteManager ];
  });

}( define ));