/* global res */
(function ( define ) {
  "use strict";

  define([
      //providers
      'providers/route-manager',
      //services
      'services/states',
      //components
      'components/section/section-module',
      'components/photo-portfolio/portfolio-module',
      'components/tunnel/tunnel-module',
      'components/landmass/land-module',
      ],
    function (
      RouteManager,
      StatesService,
      SectionModule,
      PhotoPortfolioModule,
      TunnelModule,
      LandModule
    ){

      var app, appName = 'Portfolio';

      app = angular
              .module(appName, [
                'ui.router',
                'famous.angular',
                'ngSanitize',
                SectionModule,
                PhotoPortfolioModule,
                TunnelModule,
                LandModule
              ])
              .config( RouteManager )
              .service('States', StatesService );

      angular.bootstrap( document.getElementsByTagName("html")[0], [ appName ]);


      return app;
    }
  );

}( define ));
