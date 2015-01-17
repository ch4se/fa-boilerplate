/* global famous, THREE */
var Transitionable = famous.transitions.Transitionable;
var Easing = famous.transitions.Easing;
var Scene = function(options,container,dynamic) {

  var that = this;

  if(options === undefined){
    options = {};
  }
  else{
    this.options = options;
    if(Object.observe){
      Object.observe(that.options, that.changeOptions);
    }
  }

  if(dynamic===true){
    // if(that.options.texture instanceof String){
      var tex = that.initTextures(that.options.texture[0]);
      that.options.texture = new THREE.Texture(tex);
    // }
    // else{
    //   console.log('texture is not type string for dynamic canvas. please specify a url that is crossOrigin compliant.');
    // }
  }

  if(container === undefined){
    console.log('no container specified, aborting...');
    return false;
  }
  else{
    this.container = container;
    if(container.constructor.name === 'Surface'){
      container.on('deploy',function(){
        that.init();
        that.render();
      });
    }
    else{
      that.init();
      that.render();
    }
  }

  return this;

};

Scene.prototype.setOptions = function(options){
  this.options = options;
};

Scene.prototype.changeOptions = function(changes){
  var that = this;
   function watch(change) {
    //changeFunction(that.options[change.name]);
    //  console.log(change.name + " was " + change.type + " and is now " + change.object[change.name]);
   }
   changes.forEach(watch);
};


Scene.prototype.drawTexture = function(img, opacity) {
    this.texture.c.save();
    this.texture.c.globalAlpha = opacity;
    this.texture.c.drawImage(img, 0, 0, this.texture.canvas.width, this.texture.canvas.height);
    this.texture.c.restore();
};

Scene.prototype.animateTextures = function(index, duration, curve){
    var that = this;

    that.texture.in = index;
    that.texture.fadeIn = new Transitionable(0);
    that.texture.fadeOut = new Transitionable(1);

    if(duration===undefined){
      duration = 1000;
    }

    if(curve===undefined){
      curve = Easing.inOutCubic;
    }

    that.texture.fadeIn.set(1,{duration: duration, curve: curve},function(){
      that.texture.inTransition = false;
      that.texture.out = index;
    });
    that.texture.fadeOut.set(0,{duration: duration, curve: curve},function(){
      that.texture.inTransition = false;
    });

    that.texture.inTransition = true;
};


Scene.prototype.initTextures = function(src){

  var that = this;

  this.texture = {};
  this.texture.images = [];

  this.texture.out = 0;
  this.texture.in = 1;
  this.texture.currentFade = 0;


  if(document.getElementById('texture-canvas')){
    document.body.removeChild(that.texture.canvas);
    document.body.removeChild(that.texture.img);
  }

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

  var initTexture = function(img,action){
      img.onload = function(){
        that.animateTextures(that.texture[action],5000,Easing.inOutQuart);
      };
  };

  for (var i = 0; i < that.options.texture.length; i++) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.src = that.options.texture[i];
    that.texture.images.push(img);
    if(i === that.texture.in ){
      initTexture(img,"in");
    }
    if(i === that.texture.out ){
      initTexture(img,"out");
    }

  }

  return that.texture.canvas;

};

Scene.prototype.init = function(){/*noop*/};

Scene.prototype.render = function(func,f){
  var that = this;
  if(f===undefined) { f=2; }

  function animate() {
    requestAnimationFrame(animate);
    func();
  }

  if (typeof func === 'function') {
    //check if container is a Surface TODO: change to famous?
    if(this.container.constructor.name === 'Surface'){
      famous.utilities.Timer.every(function(){
        func();
      },f);
    } //else assume its Three.js and fallback to requestAnimationFrame
    else{
      animate();
    }
  }

};