(function ( define, angular ) {
  "use strict";

  define([
      'components/landmass/land-directive'
    ],
    function (
      landDirective
    ){
      var moduleName = "Portfolio.LandMass";

      angular.module( moduleName, [] )
        .directive( "landscape", landDirective );

      return moduleName;
    }
  );

}( define, angular ));
