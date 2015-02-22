/* global respond, THREE, RuttEtraShader, famous, Scene,  $rootScope, $state */
//var s;
Scene.prototype.initTextures = function(src){

  var that = this;
  var Easing = famous.transitions.Easing;

  this.texture = {};
  this.texture.images = [];

  this.texture.out = 0;
  this.texture.in = 1;
  this.texture.currentFade = 0;

  this.texture.canvas = document.createElement('canvas');
  this.texture.canvas.id = "texture-canvas";
  this.texture.canvas.setAttribute("width",window.innerWidth);
  this.texture.canvas.setAttribute("height",window.innerHeight);
  this.texture.canvas.style.display = "none";
  //this.texture.canvas.style.left="10000px";
  window.addEventListener("orientationchange", function() {
        that.texture.canvas.setAttribute("width",window.innerWidth);
        that.texture.canvas.setAttribute("height",window.innerHeight);
        //this.texture.canvas.style.left="10000px";
  });
  //console.log(this.texture.canvas);
  document.body.appendChild(this.texture.canvas);

  this.texture.img = document.createElement('img');
  this.texture.img.id = "texture-image";
  document.body.appendChild(that.texture.img);

  this.texture.img.crossOrigin = 'anonymous';
  this.texture.c = that.texture.canvas.getContext('2d');


  for (var i = 0; i < that.options.texture.length; i++) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = that.options.texture[i];
    that.texture.images.push(img);

  }

  return that.texture.canvas;

};

(function( define ) {
  "use strict";
  /**
   * Register the Controller class with RequireJS
   */
  define([

    ],
    function (

    ){

      var SectionDirective = function( States, $famous, $rootScope, $state, $http ){
            // Returns Directive Creation Object
            var Engine              = $famous['famous/core/Engine'],
            EventHandler            = $famous['famous/core/EventHandler'],
            Transitionable          = $famous['famous/transitions/Transitionable'],
            Transform               = $famous['famous/core/Transform'],
            TransitionableTransform = $famous['famous/transitions/TransitionableTransform'],
            Easing                  = $famous['famous/transitions/Easing'],
            Timer                   = $famous['famous/utilities/Timer'],
            GenericSync             = $famous["famous/inputs/GenericSync"],
            MouseSync               = $famous["famous/inputs/MouseSync"],
            TouchSync               = $famous["famous/inputs/TouchSync"],
            ScrollSync              = $famous["famous/inputs/ScrollSync"];

            var scene;

            var LandTexture = function() {

              var that = this;
              var options = this.options;

              options.texture.minFilter = THREE.LinearFilter;
              options.texture.magFilter = THREE.LinearFilter;
              options.texture.format = THREE.RGBFormat;
              options.texture.generateMipmaps = true;

              this.canvas = $famous.find('.background-canvas')[0].renderNode;
              this.scene = new THREE.Scene();
              this.renderer = new THREE.WebGLRenderer({antialias:true});
              this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
              this.geometry = options.geometry || new THREE.PlaneBufferGeometry(120,120,120,120);
              this.material = new THREE.ShaderMaterial({
                uniforms: {
                  "tDiffuse": {
                    type: "t",
                    value: options.texture
                  },
                  "multiplier": {
                    type: "f",
                    value: options.multiplier
                  },
                  "displace": {
                    type: "f",
                    value: options.displace
                  },
                  "opacity": {
                    type: "f",
                    value: options.opacity
                  },
                  "originX": {
                    type: "f",
                    value: options.origin[0]
                  },
                  "originY": {
                    type: "f",
                    value: options.origin[1]
                  },
                  "originZ": {
                    type: "f",
                    value: options.origin[2]
                  }
                },
                vertexShader: THREE.RuttEtraShader.vertexShader,
                fragmentShader: THREE.RuttEtraShader.fragmentShader,
                depthWrite: true,
                depthTest: true,
                wireframe: options.wireframe,
                transparent: false,
                overdraw: false
              });
              this.mesh = new THREE.Mesh(that.geometry,that.material);
              this.fill = new THREE.AmbientLight(0xffffff);
              this.key = new THREE.SpotLight(0xffffff);
              this.back = new THREE.AmbientLight(0xffffff);
              this.sky = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 1.0 );
              this.composer = new THREE.EffectComposer(that.renderer);
              this.renderModel = new THREE.RenderPass(that.scene, that.camera);
              this.effectHue = new THREE.ShaderPass(THREE.HueSaturationShader);


              // sync

              GenericSync.register({
                  mouse : MouseSync,
                  touch : TouchSync,
                  scroll: ScrollSync
              });

              this.sync = new GenericSync(['mouse', 'touch', 'scroll']);
              Engine.pipe(that.sync);

              //camera

              //this.camera.position.y = -33;
              //this.camera.position.z = 100;
              this.camera.position.x = 100;
              this.camera.position.y = 25;
              this.camera.position.z = -100;

              this.target = new THREE.Vector3( 200, 25, -100 );

              this.camera.lookAt(that.target);


              //lighting

              this.fill.position.set(0, 100, 0).normalize();
              this.fill.target = that.scene;
              this.scene.add(that.fill);

              this.key.position.set(0, 45, -200).normalize();
              this.key.target = that.scene;

              this.key.intensity = 8000;
              this.key.castShadow = true;
              this.scene.add(that.key);

              this.back.position.set(0, 50, -200).normalize();
              this.back.target = that.mesh;

              this.back.intensity = 5000;
              this.back.castShadow = true;
              this.scene.add(that.back);

              this.scene.add(that.sky);




              // geometry

              this.geometry.dynamic = true;
              this.geometry.verticesNeedUpdate = true;
              this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = options.scale;
              this.mesh.position.x = 0;
              this.mesh.position.y = 0;
              this.mesh.position.z = 0;
              this.mesh.doubleSided = false;
              this.mesh.receivesShadow = true;

              this.mesh.rotation.x = -1*(Math.PI / 2);

              this.lat = 0;
              this.lon = 0;
              this.phi = 0;
              this.theta = 0;
              this.lookSpeed = 0.006;

              this.phi =  THREE.Math.degToRad( 90 - this.lat );
              this.theta = THREE.Math.degToRad( this.lon );

              this.target.x = this.camera.position.x + (100 * Math.sin( this.phi ) * Math.cos( this.theta ));
              this.target.y = this.camera.position.y + (100 * Math.cos( this.phi ));
              this.target.z = this.camera.position.z + (100 * Math.sin( this.phi ) * Math.sin( this.theta ));

              this.material.renderToScreen = true;
              this.scene.add(that.mesh);

              // events

              this.sync.on("start", function(data) {

              });

              this.sync.on("update", function(data) {

                that.lon += data.position[0] * that.lookSpeed;
                that.lat += data.position[1] * that.lookSpeed * -1;

                that.phi =  THREE.Math.degToRad( 90 - that.lat );
                that.theta = THREE.Math.degToRad( that.lon );

                that.target.x = that.camera.position.x + (100 * Math.sin( that.phi ) * Math.cos( that.theta ));
                that.target.y = that.camera.position.y + (100 * Math.cos( that.phi ));
                that.target.z = that.camera.position.z + (100 * Math.sin( that.phi ) * Math.sin( that.theta ));

                console.log(that.target);
                that.camera.lookAt( that.target );

              });

              this.sync.on("end", function(data) {

              });

              this.move = {
                left: false,
                right: false,
                forward: false,
                backward: false,
                up: false,
                down: false
              };

              Engine.on('keydown', function(e) {

                switch ( e.which ) {

                  case 38: /*up*/
                  case 87: /*W*/ that.move.forward = true; break;

                  case 37: /*left*/
                  case 65: /*A*/ that.move.left = true; break;

                  case 40: /*down*/
                  case 83: /*S*/ that.move.backward = true; break;

                  case 39: /*right*/
                  case 68: /*D*/ that.move.right = true; break;

                  case 82: /*R*/ that.move.up = true; break;
                  case 70: /*F*/ that.move.down = true; break;

                }

              });


              Engine.on('keyup', function(e) {

                switch ( e.which ) {

                  case 38: /*up*/
                  case 87: /*W*/ that.move.forward = false; break;

                  case 37: /*left*/
                  case 65: /*A*/ that.move.left = false; break;

                  case 40: /*down*/
                  case 83: /*S*/ that.move.backward = false; break;

                  case 39: /*right*/
                  case 68: /*D*/ that.move.right = false; break;

                  case 82: /*R*/ that.move.up = false; break;
                  case 70: /*F*/ that.move.down = false; break;

                }

              });

              this.moveCamera = function(cam){

                if ( this.move.forward ){
                  cam.position.z++;
                }

                if ( this.move.backward ){
                  cam.position.z--;
                }

                if (this.move.left){
                  cam.position.x++;
                }

                if (this.move.right){
                  cam.position.x--;
                }

                if (this.move.up ){
                  cam.position.y++;
                }

                if (this.move.down ){
                  cam.position.y--;
                }

                //console.log(cam.position);


              };

              //this.scene.add(new THREE.AxisHelper(1024));
              this.scene.add(new THREE.GridHelper(1024,10));
              // postprocessing

              this.composer.addPass(that.renderModel);
              //effectBloom.renderToScreen = true;
              //composer.addPass(effectBloom);
              this.effectHue.renderToScreen = true;
              this.effectHue.uniforms.hue.value = options.hue;
              this.effectHue.uniforms.saturation.value = options.saturation;
              this.composer.addPass(that.effectHue);

              this.renderer.autoClear = false;
              this.renderer.setSize( window.innerWidth, window.innerHeight );
              this.canvas._currentTarget.childNodes[0].appendChild( that.renderer.domElement );

              this.render(function(){

                  that.moveCamera(that.camera);
                  that.options.texture.needsUpdate = true;

                  if(that.texture.inTransition === true){
                    that.drawTexture(that.texture.images[that.texture.in], that.texture.fadeIn.get());
                    that.drawTexture(that.texture.images[that.texture.out], that.texture.fadeOut.get());
                  }
                  that.material.uniforms.displace.value = that.options.displace;
                  that.material.uniforms.multiplier.value = that.options.multiplier;
                  that.material.uniforms.opacity.value = parseFloat(that.options.opacity);
                  that.material.uniforms.originX.value = parseFloat(that.options.origin[0]);
                  that.material.uniforms.originY.value = parseFloat(that.options.origin[1]);
                  that.material.uniforms.originZ.value = parseFloat(that.options.origin[2]);
                  that.effectHue.uniforms.hue.value = that.options.hue;
                  that.effectHue.uniforms.saturation.value = that.options.saturation;

                  that.composer.render();
                  that.renderer.setClearColor(0xA1BBFB, 1);
                  that.renderer.render( that.scene, that.camera );

              });

            };

            return {
              restrict: "AE",
              templateUrl: "./components/landmass/land.html",
              scope:true,
              link: {
                pre: function(scope, iElem, iAttrs, controller) {

                },
                post: function(scope, iElem, iAttrs, controller) {

                  scope.masterIndex = 0;
                  scope.masterLimit = 4;

                  scope.zoom = false;

                 // var dotNav = document.querySelector('.dot-nav');

                  // add perspective to the container group
                  var group = $famous.find('.section-controller')[0].renderNode._container;
                  group.classList.add('depth');

                  var initCanvas = function(textures){
                    /* begin scene */
                    scene = new Scene({
                        scale : 4.0,
                        multiplier : 4.0,
                        displace : 6.0,
                        origin : [0,-200,-200],
                        opacity : 0.8,
                        hue : 0.0,
                        bloom : 3.5,
                        saturation : 0.0,
                        wireframe : false,
                        geometry: new THREE.PlaneBufferGeometry(1024,1024,1024,1024),
                        //texture : THREE.ImageUtils.loadTexture('assets/the-sky-is-burning.jpg')
                        texture : textures
                    },$famous.find('.background-canvas')[0].renderNode, true);

                    window.scene = scene;
                    Scene.prototype.init = LandTexture;


                    var tex = scene.initTextures(scene.options.texture[0]);
                    scene.options.texture = new THREE.Texture(tex);

                    ///inT(scope.masterIndex);
                    setTimeout(function(){
                      scene.animateTextures(scope.masterIndex,1000,Easing.outElastic);
                    },300);

                  };

                  var canvas = $famous.find('.background-canvas')[0].renderNode;
                  canvas.on('deploy',function(){

                    var textures = [];

                    if(iAttrs.canvas !== 'false'){
                      scope.canvasOpacity = 1.0;
                      initCanvas(scope.textures);
                    }
                    else{
                      scope.canvasOpacity = 0.8;
                      initCanvas(scope.textures);
                    }


                  });


                  var vignetteHeight = window.innerHeight * 2;
                  // defaults
                  scope.content = {
                    canvas:{
                      size:[window.innerWidth,window.innerHeight]
                    },
                    section:{
                      size: [window.innerWidth,window.innerHeight],
                      position: [0,0,0]
                    },
                    vignette:{
                      size:[undefined,vignetteHeight]
                    }
                  };


                  var resetVignette = function(){

                    scope.content.section.size = [window.innerWidth,window.innerHeight];
                    vignetteHeight = window.innerHeight * 2;
                    scope.content.vignette.size = [window.innerWidth, vignetteHeight];

                  };


                  scope.mobile = function(){

                  };

                  scope.phablet = function(){

                  };

                  scope.tablet = function(){

                  };

                  scope.small = function(){

                  };

                  scope.medium = function(){

                  };

                  scope.large = function(){

                  };

                  scope.ultrahd = function(){

                  };

                  window.addEventListener('stateChange',function(){


                    scene.renderer.setSize( window.innerWidth, window.innerHeight );
                    resetVignette();
                    scope.state = respond.state;

                  });

                  $http.get('./models/index.json').then(function(res){


                    States.stateChange(scope);


                  });


                },
              }
            };
          }; // End Directive def


      // If Using Angular Dep Injection
      return [ "States", "$famous", "$rootScope", "$state", "$http", SectionDirective ];
    } // end require function
  ); // end define call

}( define ));
