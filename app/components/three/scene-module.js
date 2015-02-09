(function ( define, angular ) {
  "use strict";

  define([
      'components/three/scene-directive'
    ],
    function (
     SceneDirective
    ){
      var moduleName = "Portfolio.Scene";

      angular.module( moduleName, [] )
        .directive( "scene", SceneDirective );

      return moduleName;
    }
  );

}( define, angular ));
