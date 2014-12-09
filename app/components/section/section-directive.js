/* global respond, Synth */
var s;

(function( define ) {
  "use strict";
  /**
   * Register the Controller class with RequireJS
   */
  define([

    ],
    function (

    ){

      var SectionDirective = function( States, $famous ){
            // Returns Directive Creation Object
            var Engine              = $famous['famous/core/Engine'],
            Transitionable          = $famous['famous/transitions/Transitionable'],
            TransitionableTransform = $famous['famous/transitions/TransitionableTransform'],
            Easing                  = $famous['famous/transitions/Easing'],
            Timer                   = $famous['famous/utilities/Timer'],
            GenericSync             = $famous["famous/inputs/GenericSync"],
            MouseSync               = $famous["famous/inputs/MouseSync"],
            TouchSync               = $famous["famous/inputs/TouchSync"],
            ScrollSync              = ["famous/inputs/ScrollSync"];

            var delta = [0,0];
            var fDelta = [0,0];
            var transform = 100;
            var fTransform = 0;
            var masterLimit = 4;
            var vignetteHeight = window.innerHeight * 2;
            return {
              restrict: "AE",
              require:"ngModel",
              templateUrl: "./components/section/section.html",
              scope:true,
              link: {
                pre: function(scope, iElem, iAttrs, controller) {

                },
                post: function(scope, iElem, iAttrs, controller) {

                  scope.masterIndex = 0;

                  scope.zoom = false;

                  var dotNav = document.querySelector('.dot-nav');

                  // add perspective to the container group
                  var group = $famous.find('.mh-onboard-controller')[0].renderNode._container;
                  group.classList.add('depth');

                  var canvas = $famous.find('.background-canvas')[0].renderNode;
                  canvas.on('deploy',function(){

                    s = new Synth(canvas._currentTarget,false,false,[{
                        "camera": "0.0,-1130.0,180.0",
                        "shape": "plane",
                        "detail": 720,
                        "scale" : 10.0,
                        "wireframe": true,
                        "multiplier": 4.0,
                        "displace": 1.5,
                        "origin": "0,0,-2400.0",
                        "opacity": 1.0,
                        "hue": 0,
                        "saturation": 1.0,
                        "bgColor": "#030304"
                    }]);
                    s.defaultVideo('assets/flying-over-los-angeles-at-night.mp4');
                    // if(respond.os !== 'ios' && respond.device !=='iphone' && respond.device !=='ipod' ){
                      document.getElementById('video').play();
                    // }
                    // else{
                    //   document.getElementById('video').currentTime = 200;
                    // }

                  });

                  // defaults
                  scope.content = {
                    grid:{
                      options: {
                       dimensions:[2,3]
                      }
                    },
                    scroll:{
                      speedLimit: 1,
                      paginated:true,
                      clipSize: window.innerHeight
                    },
                    canvas:{
                      size:[window.innerWidth,window.innerHeight]
                    },
                    section:{
                      size: [window.innerWidth,window.innerHeight],
                      position: [0,0,0],
                      elements:{
                        copy:{
                          scale:[],
                          align:[]
                        },
                        fore:{
                          scale:[],
                          opacity: 1.0
                        },
                        back:{
                          scale:[],
                          opacity: 0.75
                        },
                        source:{
                          scale:[],
                          opacity: 1.0
                        },
                        contributor:{
                          scale:[],
                          opacity: 0.75
                        }
                      },
                      copy:{
                        opacity:0.0
                      },
                      icons: {
                        size:[256, 256],
                        scale: [1.0,1.0]
                      },
                      background:{
                        position: [0,0,0]
                      },
                      scrollButton:{
                        rotate: (Math.PI/180)*-90,
                        display: 0
                      },
                      forwardButton:{
                        rotate: (Math.PI/180)*180,
                        display: 0
                      },
                      backButton:{
                        rotate: 0,
                        display: 1,
                        show: false
                      },
                      scrollview:{
                        options:{
                          direction:'x'
                        }
                      },
                      parentLayout:{
                        options:{
                          direction: 0
                        },
                        size:[window.innerWidth/1.5,160]
                      },
                      childLayout:{
                        options:{
                          direction: 0
                        },
                        size:[320,360],
                        child:{
                          size:[320,120]
                        }
                      },
                      done:{
                        display: 1
                      }
                    },
                    vignette:{
                      size:[undefined,vignetteHeight]
                    }
                  };

                  scope.transition = true;

                  var resetVignette = function(){

                    scope.content.section.size = [window.innerWidth,window.innerHeight];
                    vignetteHeight = window.innerHeight * 2;
                    scope.content.vignette.size = [window.innerWidth, vignetteHeight];
                    transform = 150;

                  };

                  scope.p = [];
                  scope.c = [];
                  scope.o = [];
                  scope.op = [];
                  scope.i = [];

                  var offset = 0;
                  var inT = function(tIndex,v){
                      scope.content.section.scrollButton.display = 0;
                      scope.op[tIndex].set(0);
                      scope.c[tIndex].set(0);
                      scope.p[tIndex].setTranslate([0,0,-1000]);
                      scope.i[tIndex].setTranslate([0,0,-2000]);
                      scope.op[tIndex].set(1,{duration: 10});
                      scope.c[tIndex].set(1,{duration: 500});

                      scope.p[tIndex].setTranslate([0,0,transform],{duration:800},function(){
                        scope.p[tIndex].setTranslate([0,0,(transform/2)],{duration:400},function(){
                          scope.transition = false;
                        });
                      });

                  };

                  var outT = function(tIndex,v){

                      scope.c[tIndex].set(0,{duration:500});
                      scope.p[tIndex].setTranslate([0,0,3000],{duration:3000},function(){
                        scope.p[tIndex].setTranslate([0,-10000,3000]);
                      });
                  };

                  var backT = function(tIndex,v){
                    scope.content.section.scrollButton.display = 0;

                    scope.c[tIndex].set(0,{duration:500});
                    scope.op[tIndex].set(0,{duration:500});
                    scope.p[tIndex].setTranslate([0,0,-1000],{duration:2000},function(){
                      scope.transition = false;
                    });


                  };

                  var fromT = function(tIndex,v){
                    scope.op[tIndex].set(0);
                    scope.c[tIndex].set(0);
                    scope.p[tIndex].setTranslate([0,0,3000]);
                    scope.op[tIndex].set(1,{duration: 10});
                    scope.c[tIndex].set(1,{duration: 500});

                    scope.p[tIndex].setTranslate([0,0,transform],{duration:1200},function(){
                      scope.p[tIndex].setTranslate([0,0,(transform/2)],{duration:400},function(){
                        scope.transition = false;
                      });
                    });
                  };

                  for(var index=0; index<=masterLimit; index++){
                  //setup transitionables for vignette 1
                    scope.o[index] = new Array(64);
                    scope.op[index] = new Transitionable(0);
                    scope.p[index] = new TransitionableTransform();
                    scope.i[index] = new TransitionableTransform();
                    scope.c[index] = new Transitionable(0);
                    //scope.o[index] = new Transitionable(0);
                    //console.log(inT);
                    //console.log(outT);
                  }


                  scope.mobile = function(){
                    scope.content.section.icons.scale = [0.45,0.45];
                    scope.content.section.icons.size = [80,80];
                    scope.content.section.elements.copy.align =  [0.1,0.1];
                    scope.content.section.elements.copy.size =  [respond.grid.colSpan[4],true];
                    scope.content.section.elements.copy.scale = [0.8,0.8];
                    scope.content.section.elements.fore.scale = [0.3,0.3];
                    scope.content.section.elements.back.scale = [0.15,0.15];
                    scope.content.section.elements.source.scale = [0.5,0.5];
                    scope.content.section.elements.contributor.scale = [0.33,0.33];
                    scope.content.section.childLayout.size = [280,312];
                    scope.content.section.childLayout.child.size = [280,110];
                    if(respond.device === 'desktop'){
                      scope.content.section.parentLayout.scale = [1.0,1.0];
                    }
                    else{
                      scope.content.section.parentLayout.scale = [0.9,0.9];
                    }
                  };

                  scope.phablet = function(){
                    scope.content.section.icons.scale = [0.425,0.425];
                    scope.content.section.icons.size = [80,80];
                    scope.content.section.elements.copy.align =  [0.1,0.1];
                    scope.content.section.elements.copy.size =  [respond.grid.colSpan[4],true];
                    scope.content.section.elements.copy.scale = [0.8,0.8];
                    scope.content.section.elements.fore.scale = [0.4,0.4];
                    scope.content.section.elements.back.scale = [0.3,0.3];
                    scope.content.section.elements.source.scale = [0.66,0.66];
                    scope.content.section.elements.contributor.scale = [0.425,0.425];
                    scope.content.section.childLayout.size = [280,312];
                    scope.content.section.childLayout.child.size = [280,110];
                    if(respond.device === 'desktop'){
                      scope.content.section.parentLayout.scale = [1.0,1.0];
                    }
                    else{
                      scope.content.section.parentLayout.scale = [1.0,1.0];
                    }
                  };

                  scope.tablet = function(){
                    scope.content.section.icons.scale = [0.45,0.45];
                    scope.content.section.icons.size = [100,100];
                    scope.content.section.elements.copy.align =  [0.1,0.33];
                    scope.content.section.elements.copy.size =  [respond.grid.colSpan[6],true];
                    scope.content.section.elements.copy.scale = [0.85,0.85];
                    scope.content.section.elements.fore.scale = [0.55,0.55];
                    scope.content.section.elements.back.scale = [0.3,0.3];
                    scope.content.section.elements.source.scale = [0.9,0.9];
                    scope.content.section.elements.contributor.scale = [0.66,0.66];
                    scope.content.section.childLayout.size = [280,360];
                    scope.content.section.childLayout.child.size = [280,110];
                    scope.content.section.parentLayout.scale = [1.0,1.0];
                  };

                  scope.small = function(){
                    scope.content.section.icons.scale = [0.5,0.5];
                    scope.content.section.icons.size = [128,128];
                    scope.content.section.elements.copy.align =  [0.2,0.33];
                    scope.content.section.elements.copy.size =  [respond.grid.colSpan[6],true];
                    scope.content.section.elements.copy.scale = [1.0,1.0];
                    scope.content.section.elements.fore.scale = [0.75,0.75];
                    scope.content.section.elements.back.scale = [0.5,0.5];
                    scope.content.section.elements.source.scale = [0.9,0.9];
                    scope.content.section.elements.contributor.scale = [0.66,0.66];
                    scope.content.section.childLayout.size = [280,360];
                    scope.content.section.childLayout.child.size = [280,110];
                    scope.content.section.parentLayout.scale = [1.0,1.0];
                  };

                  scope.medium = function(){
                    scope.content.section.icons.scale = [0.75,0.75];
                    scope.content.section.icons.size = [200,200];
                    scope.content.section.elements.copy.align =  [0.2,0.33];
                    scope.content.section.elements.copy.size =  [respond.grid.colSpan[6],true];
                    scope.content.section.elements.copy.scale = [1.0,1.0];
                    scope.content.section.elements.fore.scale = [0.8,0.8];
                    scope.content.section.elements.back.scale = [0.6,0.6];
                    scope.content.section.elements.source.scale = [1.15,1.15];
                    scope.content.section.elements.contributor.scale = [0.75,0.75];
                    scope.content.section.childLayout.size = [280,360];
                    scope.content.section.childLayout.child.size = [280,110];
                    scope.content.section.parentLayout.scale = [1.0,1.0];
                  };

                  scope.large = function(){
                    scope.content.section.icons.scale = [1.0,1.0];
                    scope.content.section.icons.size = [256,256];
                    scope.content.section.elements.copy.align =  [0.2,0.1];
                    scope.content.section.elements.copy.size =  [respond.grid.colSpan[6],true];
                    scope.content.section.elements.copy.scale = [1.0,1.0];
                    scope.content.section.elements.fore.scale = [0.8,0.8];
                    scope.content.section.elements.back.scale = [0.5,0.5];
                    scope.content.section.elements.source.scale = [1.15,1.15];
                    scope.content.section.elements.contributor.scale = [0.75,0.75];
                    scope.content.section.childLayout.size = [280,360];
                    scope.content.section.childLayout.child.size = [280,110];
                    scope.content.section.parentLayout.scale = [1.0,1.0];
                  };

                  scope.ultrahd = function(){
                    scope.large();
                  };

                  // tracks mouse and touch movements so they can be synced with cursors
                  GenericSync.register({
                    "mouse": MouseSync,
                    "touch": TouchSync,
                    "scroll": ScrollSync
                  });

                  // syncs mouse and touch movement with scrubber cursor
                  var sync = new GenericSync(
                    ["mouse", "touch", "scroll"]
                  );

                  Engine.pipe(sync);

                  scope.nextVignette = function(){
                    console.log('trigger next vignette');
                    scope.transition = true;
                    dotNav.children[scope.masterIndex].className = "dot";
                    outT(scope.masterIndex,scope.vignettes);
                    scope.masterIndex++;
                    dotNav.children[scope.masterIndex].className = "dot active";
                    inT(scope.masterIndex,scope.vignettes);
                    scope.zoom = true;
                    if(!scope.$$phase){
                      scope.$apply();
                    }
                  };
                  scope.lastVignette = function(){
                    console.log('trigger last vignette');
                    scope.transition = true;
                    dotNav.children[scope.masterIndex].className = "dot";
                    backT(scope.masterIndex,scope.vignettes);
                    scope.masterIndex--;
                    dotNav.children[scope.masterIndex].className = "dot active";
                    fromT(scope.masterIndex,scope.vignettes);
                    scope.zoom = true;
                    if(!scope.$$phase){
                      scope.$apply();
                    }
                  };



                  sync.on("update", function(data) {
                      //update++;
                      //position = data.position;
                      delta = data.delta;

                      if(scope.transition === false){

                        if(delta[1] < -30){
                          if(scope.masterIndex < masterLimit){
                           scope.nextVignette();
                          }
                        }
                        else if(delta[1] > 30){
                          if(scope.masterIndex > 0){
                           scope.lastVignette();
                          }
                        }
                        else if (delta[1] < 0){
                         // console.log('increase');
                          transform = transform + 1;
                          scope.transition = true;
                          scope.p[scope.masterIndex].setTranslate([0,0,transform],{duration:10},function(){
                            scope.transition = false;
                            scope.zoom = false;
                          });
                        }
                        else if (delta[1] > 0){
                          //console.log('decrease');
                          transform = transform - 1;
                          scope.transition = true;
                          scope.p[scope.masterIndex].setTranslate([0,0,transform],{duration:10},function(){
                            scope.transition = false;
                            scope.zoom = false;
                          });
                        }

                        //console.log(delta);

                      } // end if transition === false
                  });

                  window.addEventListener('stateChange',function(){

                    scope.content.section.parentLayout.size = [window.innerWidth/1.5,140];
                    resetVignette();
                    inT(scope.masterIndex);
                    console.log(respond.state);

                  });



                  States.stateChange(scope);
                  resetVignette();
                  inT(scope.masterIndex,scope.vignettes);



                },
              }
            };
          }; // End Directive def


      // If Using Angular Dep Injection
      return [ "States", "$famous", SectionDirective ];
    } // end require function
  ); // end define call

}( define ));
