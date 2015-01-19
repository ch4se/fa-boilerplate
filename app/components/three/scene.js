/* global famous, THREE */
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