(function( define ) {
  "use strict";

  /**
   * Register the Controller class with RequireJS
   */
  define([
      // Deps,
    ],
    function (
      // Deps Vars
    ){

      var PhotoPortfolioDirective = function( $famous, States ){
            // Returns Directive Creation Object
            return {
              restrict: "AE",
              scope: true,
              require: 'ngModel',
              templateUrl: "./components/photo-portfolio/portfolio.html",
              link: {
                pre: function(scope, iElem, iAttrs) {
                  // Before child scopes have been linked
                },
                post: function(scope, iElem, iAttrs, controller) {

                  scope.scrollview = {
                    clipSize : 0,
                    speedLimit: 1,
                  };

                  scope.grid = {
                    size: [0,0],
                    options : {
                      dimensions: [6,6]
                    }
                  };

                  var Engine = $famous['famous/core/Engine'];
                  var EventHandler = $famous['famous/core/EventHandler'];

                  scope.scrollHandler = new EventHandler();
                  Engine.pipe(scope.scrollHandler);

                  scope.photoMeta = {
                   size: [window.innerWidth / 6,window.innerWidth / 6]
                  };

                  scope.mobile = function(){
                    scope.photoMeta.size = [window.innerWidth, window.innerWidth];
                    scope.grid.size = [window.innerWidth,window.innerWidth*scope.collection.length];
                    scope.scrollview.clipSize = window.innerWidth*scope.collection.length;
                    scope.grid.options.dimensions = [1,scope.collection.length];
                  };

                  scope.phablet = function(){
                    scope.photoMeta.size = [window.innerWidth / 2,window.innerWidth / 2];
                    scope.grid.size = [window.innerWidth,(window.innerWidth/2)*(scope.collection.length/2)];
                    scope.scrollview.clipSize = (window.innerWidth/2)*(scope.collection.length/2);
                    scope.grid.options.dimensions = [2,scope.collection.length/2];
                  };

                  scope.tablet = function(){
                    scope.photoMeta.size = [window.innerWidth / 3,window.innerWidth / 3];
                    scope.grid.size = [window.innerWidth,(window.innerWidth/3)*(scope.collection.length/3)];
                    scope.scrollview.clipSize = (window.innerWidth/3)*(scope.collection.length/3);
                    scope.grid.options.dimensions = [3,scope.collection.length/3];
                  };

                  scope.small = function(){
                    scope.photoMeta.size = [window.innerWidth / 4,window.innerWidth / 4];
                    scope.grid.size = [window.innerWidth,(window.innerWidth/4)*(scope.collection.length/4)];
                    scope.scrollview.clipSize = (window.innerWidth/4)*(scope.collection.length/4);
                    scope.grid.options.dimensions = [4,scope.collection.length/4];
                  };

                  scope.medium = function(){
                    scope.photoMeta.size = [window.innerWidth / 6,window.innerWidth / 6];
                    scope.grid.size = [window.innerWidth,(window.innerWidth/6)*(scope.collection.length/6)];
                    scope.scrollview.clipSize = (window.innerWidth/6)*(scope.collection.length/6);
                    scope.grid.options.dimensions = [6,scope.collection.length/6];
                  };

                  scope.large = function(){
                    scope.photoMeta.size = [window.innerWidth / 8,window.innerWidth / 8];
                    scope.grid.size = [window.innerWidth,(window.innerWidth/8)*(scope.collection.length/8)];
                    scope.scrollview.clipSize = (window.innerWidth/8)*(scope.collection.length/8);
                    scope.grid.options.dimensions = [8,scope.collection.length/8];
                  };

                  scope.ultrahd = function(){
                    scope.large();
                  };

                  controller.$render = function() {

                    States.stateChange( scope );

                  };



              }
            }
          };// End Directive def


      };
      // If Using Angular Dep Injection
      return [ "$famous", "States", PhotoPortfolioDirective];
    } // end require function
  ); // end define call

}( define ));
