/*global head, res, System, THREE, famous*/
var respond;
(function( window, head ) {
  "use strict";

  // Promise Shim
  if( typeof window.Promise === 'undefined' || typeof window.Promise.all !== 'function' ){
    head.load('lib/promise.js', function(){ console.log('Promise Shim Loaded'); });
  }

  if(!Object.observe){
    head.load('lib/observe.js', function(){ console.log('Observe Shim Loaded'); });
  }

  head
    .load(
      'lib/famous-global.js',
      'lib/three.js',
      'components/three/scene.js',
      'components/shaders/shaders.js',
      'components/scenes/scenes.js',
      //'lib/synth.js',
      'lib/angular.js',
      'lib/angular-ui-router.js',
      'lib/angular-sanitize.js',
      'lib/famous-angular.js',
      'lib/res.js',
      'lib/require.js'
    )
    .ready("ALL", function() {

      // create an instance of res.js globally
      respond = new res([{"state": "mobile","breakpoint": 320,"cols": 4,"margin": 10,"gutter": 10},
                       {"state": "phablet","breakpoint": 568,"cols": 4,"margin": 10,"gutter": 10},
                       {"state": "tablet","breakpoint": 768,"cols": 12,"margin": 40,"gutter": 20},
                       {"state": "small","breakpoint": 1024,"cols": 12,"margin": 40,"gutter": 20},
                       {"state": "medium","breakpoint": 1366,"cols": 16,"margin": 80,"gutter": 20},
                       {"state": "large","breakpoint": 1920,"cols": 16,"margin": 80,"gutter": 40},
                       {"state": "ultrahd","breakpoint": 10000,"cols": 16,"margin": 120,"gutter": 40}]);
      console.log(respond);

      // Main RequireJS Config
      require.config({
      //  baseUrl:'./',
        paths:{
          //'synth'     : 'lib/synth',
          'three'     : 'lib/three',
          'routes'    : 'providers/route-manager'
        },
        shim:{
          'routes' : {
            init:function(){

            }
          }
        }
      });

      require( [ "app" ], function( app ){

        // Application has bootstrapped... needed for Firefox
        if( angular.resumeBootstrap && respond.browser === 'firefox' ){

          angular.resumeBootstrap();

        }

      });

    }); // end .ready()
}( window, head ));

