(function ( define, angular ) {
  "use strict";

  define([
      'components/section/section-directive'
    ],
    function (
      sectionDirective
    ){
      var moduleName = "NewApp.Section";

      angular.module( moduleName, [] )
        .directive( "pSection", sectionDirective );

      return moduleName;
    }
  );

}( define, angular ));
