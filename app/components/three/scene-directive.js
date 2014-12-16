/* global THREE, RuttEtraShader, famous, Scene */
(function( define ) {
  "use strict";

  define([

    ],
    function (){
      var SceneDirective = function( $famous ){
            // Returns Directive Creation Object

            var Engine              = $famous['famous/core/Engine'],
            Modifier                = $famous['famous/core/Modifier'],
            StateModifier           = $famous['famous/modifiers/StateModifier'],
            Transform               = $famous['famous/core/Transform'],
            Transitionable          = $famous['famous/transitions/Transitionable'],
            TransitionableTransform = $famous['famous/transitions/TransitionableTransform'],
            Easing                  = $famous['famous/transitions/Easing'],
            Timer                   = $famous['famous/utilities/Timer'],
            GenericSync             = $famous["famous/inputs/GenericSync"],
            MouseSync               = $famous["famous/inputs/MouseSync"],
            TouchSync               = $famous["famous/inputs/TouchSync"],
            ScrollSync              = $famous["famous/inputs/ScrollSync"];

            return {
              restrict: "AE",
              templateUrl: "./components/three/scene.html",
              link: {
                pre: function(scope, iElem, iAttrs) {

                },
                post: function(scope, iElem, iAttrs) {

                    scope.content = {
                      canvas:{
                        size:[window.innerWidth,window.innerHeight]
                      }
                    };

                    var InfiniteZoom = function() {

                      var that = this;
                      var options = this.options;

                      options.texture.minFilter = THREE.LinearFilter;
                      options.texture.magFilter = THREE.LinearFilter;
                      options.texture.format = THREE.RGBFormat;
                      options.texture.generateMipmaps = true;

                      this.canvas = $famous.find('.background-canvas')[0].renderNode;
                      this.scene = new THREE.Scene();
                      this.renderer = new THREE.WebGLRenderer({antialias:true});
                      this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 100000 );
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
                      this.fill = new THREE.PointLight(0xffffff);
                      this.key = new THREE.AmbientLight(0xffffff);
                      this.back = new THREE.SpotLight(0xffffff);
                      this.composer = new THREE.EffectComposer(that.renderer);
                      this.renderModel = new THREE.RenderPass(that.scene, that.camera);
                      this.effectHue = new THREE.ShaderPass(THREE.HueSaturationShader);

                      var transitionable = new Transitionable([0, 0, 8000]);
                      transitionable.set([0, 0, -200],{duration: 20000, curve: Easing.inOutCubic},function(){
                        transitionable.set([0, 0, 8000],{duration: 20000, curve: Easing.inOutCubic});
                      });

                      // sync

                      GenericSync.register({
                          mouse : MouseSync,
                          touch : TouchSync
                      });

                      this.sync = new GenericSync(['mouse', 'touch']);
                      Engine.pipe(that.sync);

                      //camera

                      //this.camera.position.y = -33;
                      //this.camera.position.z = 100;
                      this.camera.lookAt(that.scene.position);

                      //lighting

                      this.fill.position.set(0, 0, 0).normalize();
                      this.scene.add(that.fill);

                      this.key.position.set(0, -50, 50).normalize();
                      this.key.target = that.mesh;

                      this.key.intensity = 5000;
                      this.key.castShadow = true;
                      this.scene.add(that.key);

                      this.back.position.set(0, 0, -5000).normalize();
                      this.back.target = that.mesh;

                      this.back.intensity = 5000;
                      this.back.castShadow = true;
                      this.scene.add(that.back);


                      // geometry

                      this.geometry.dynamic = true;
                      this.geometry.verticesNeedUpdate = true;

                      this.mesh.doubleSided = true;
                      //this.mesh.position.x = this.mesh.position.y = this.mesh.position.z = 0;
                      //this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = options.scale;

                      this.material.renderToScreen = true;
                      //this.material.uniforms.originZ.value = options.origin[2];

                      this.scene.add(that.mesh);

                      // events

                      // this.sync.on("start", function(data) {
                      //    that.material.uniforms.originX.value = data.position[0] * 0.5;
                      //    that.material.uniforms.originY.value = data.position[1] * -0.5;
                      // });

                      // this.sync.on("update", function(data) {
                      //    that.material.uniforms.originX.value = data.position[0] * 0.5;
                      //    that.material.uniforms.originY.value = data.position[1] * -0.5;
                      // });

                      // this.sync.on("end", function(data) {
                      //    that.material.uniforms.originX.value = data.position[0] * 0.5;
                      //    that.material.uniforms.originY.value = data.position[1] * -0.5;
                      // });

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
                         that.composer.render();
                         that.renderer.render( that.scene, that.camera );
                         that.camera.position.x = transitionable.get()[0];
                         that.camera.position.y = transitionable.get()[1];
                         that.camera.position.z = transitionable.get()[2];
                         console.log(that.material.uniforms.originY.value);
                      });

                    };

                    /* begin scene */
                    var scene = new Scene({
                        scale : 10.0,
                        multiplier : 108.0,
                        displace : 108.0,
                        origin : [0,0,0],
                        opacity : 0.8,
                        hue : 0.0,
                        bloom : 3.5,
                        saturation : 0.5,
                        wireframe : true,
                        geometry: new THREE.TorusGeometry(120,120,120),
                        texture : THREE.ImageUtils.loadTexture('assets/the-sky-is-burning.jpg')
                    },$famous.find('.background-canvas')[0].renderNode);

                    window.scene = scene;
                    Scene.prototype.init = InfiniteZoom;


                },
              }
            };
          }; // End Directive def


      // If Using Angular Dep Injection
      return [ "$famous", SceneDirective ];

      //return SceneDirective;
    } // end require function
  ); // end define call

}( define ));
