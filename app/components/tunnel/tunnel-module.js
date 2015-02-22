(function ( define, angular ) {
  "use strict";

  define([
      'components/tunnel/tunnel-directive'
    ],
    function (
      tunnelDirective
    ){
      var moduleName = "Portfolio.Tunnel";

      angular.module( moduleName, [] )
        .directive( "tunnel", tunnelDirective );

      return moduleName;
    }
  );

}( define, angular ));
