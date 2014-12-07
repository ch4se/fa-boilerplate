/* global res */
(function ( define ) {
  "use strict";

  define([
      //providers
      'providers/route-manager',
      //services
      'services/states',
      //components
      'components/section/section-module'
      ],
    function (
      RouteManager,
      StatesService,
      SectionModule
    ){

      var app, appName = 'NewApp';

      app = angular
              .module(appName, [
                'ui.router',
                'famous.angular',
                'ngSanitize',
                SectionModule

              ])
              .config( RouteManager )
              .service('States', StatesService );

      angular.bootstrap( document.getElementsByTagName("html")[0], [ appName ]);


      return app;
    }
  );

}( define ));
