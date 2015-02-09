(function ( define, angular ) {
  "use strict";

  define([
      'components/photo-portfolio/portfolio-directive'
    ],
    function (
      PhotoPortfolioDirective
    ){
      var moduleName = "Portfolio.Photos";

      angular.module( moduleName, [] )
        .directive( "photoPortfolio", PhotoPortfolioDirective );

      return moduleName;
    }
  );

}( define, angular ));
