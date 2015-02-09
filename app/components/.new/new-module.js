(function ( define, angular ) {
  "use strict";

  define([
      'components/.new/new-controller',
      'components/.new/new-directive'
    ],
    function (
      NewController,
      NewDirective
    ){
      var moduleName = "Portfolio.New";

      angular.module( moduleName, [] )
        .directive( "newTag", NewDirective )
        .controller( "newController", NewController );

      return moduleName;
    }
  );

}( define, angular ));
