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
                    subheadline:"",
                    copy:""
                  },
                  {
                    headline:"Dependable Web Engineer",
                    subheadline:"Developing websites since 1998.",
                    copy:"Steve currently develops on a MEAN stack and is active in the Famo.us / Angular community. He is in the top 100 Developers in L.A. according to GoodData, was featured in Web Designer magazine and has Editor's Picks on <a href='http://codepen.io/steveblue/'>Codepen.io</a>."
                  },
                  {
                    headline:"Dev Magnet",
                    subheadline:"Flipboard magazine about development.",
                    copy:"Steve curates Dev Magnet on Flipboard. Updated regularly with news and tips for Developers and Makers, Dev Magnet is available on the web at <a href='http://devmagnet.net'>devmagnet.net</a>."
                  },
                  // {
                  //   headline:"Res.js",
                  //   subheadline:"A lightweight JS library for Responsive web apps.",
                  //   copy:"Res.js is a swiss army knife for Responsive web sites. This library weighing in at about 5kb gives developers easy access to User Agent and the ability to make thier web app stateful. Res.js is open source and <a href='https://github.com/steveblue/res'>available on Github</a>."
                  // },
                  {
                    headline:"Synth",
                    subheadline:"Video synthesizer for the web.",
                    copy:"Synth is a web app for creative coders to show off interactive visualizations. Originally a Chrome Experiment, this web app is going into beta after successfully being funded on Kickstarter."
                  },
                  {
                    headline:"Kinetic Light",
                    subheadline:"Solo exhibition of digital art in L.A.",
                    copy:"Exhibition in Los Angeles is Steve's first solo exhbition of digital art. The exhibit included original abstract digital photography and video art. Purchase the Kinetic Light ebook from the iBookstore."
                  }]
                };

              }
            });
          // end states
    };

    return ["$stateProvider", "$urlRouterProvider", "$locationProvider", RouteManager ];
  });

}( define ));