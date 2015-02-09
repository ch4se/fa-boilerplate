/* global famous */
define(function(require, exports, module) {

  var Utility = famous.utilities.Utility;
  var MouseSync = famous.inputs.MouseSync;
  var TouchSync = famous.inputs.TouchSync;
  var ScrollSync = famous.inputs.ScrollSync;
  var GenericSync = famous.inputs.GenericSync;
  var Transitionable = famous.transitions.Transitionable;
  var Easing = famous.transitions.Easing;
  var OptionsManager = famous.core.OptionsManager;

  // TODO: incorporate Physics Engine
  var SpringTransition = famous.transitions.SpringTransition;
  Transitionable.registerMethod('spring', SpringTransition);

  GenericSync.register({
    "mouse": MouseSync,
    "touch": TouchSync,
    "scroll": ScrollSync
  });


  var ScrollHandler = function(options) {

    // public vars

    this.position = new Transitionable([0, 0, 0]);

    // options

    this.options = Object.create(ScrollHandler.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);

    // getters and setters

    Object.defineProperty(this, "preventScroll", {
      get: function() {
        return this._stopScroll;
      },
      set: function(b) {
        this._stopScroll = b;
      }
    });

    // private vars

    this._onEdge = false;
    this._stopScroll = false;
    this._pos = 0.0;
    this._posArray = [0, 0, 0];

    this.sync = new GenericSync({
      "mouse": {},
      "touch": {
        rails: true,
        scale: 0.5
      },
      "scroll": {
        rails: true,
        scale: 0.5
      }
    });

    //private methods

    function _hitEdge() {

      var self = this;

      if (this.options.direction === Utility.Direction.X) {
        this._posArray = [this._pos, 0, 0];
      }
      if (this.options.direction === Utility.Direction.Y) {
        this._posArray = [0, this._pos, 0];
      }

      this.position.set(this._posArray, {
        method: 'spring',
        dampingRatio: 0.6,
        period: 600
      }, function() {
        //self.position.set(self._posArray);
        self._onEdge = false;
      });
      // this.position.set(this._posArray,{duration:1400,curve:this.options.easing},function(){
      //   self.position.set(self._posArray);
      //   self._onEdge = false;
      // });
    }

    function _bindEvents() {

      var self = this;

      this.sync.on('update', function(ev) {

        // when scroller hits minimum, disable scroll and set Transitionable;
        if (self._pos > self.options.max && self._onEdge === false && self._stopScroll === false) {

          self._onEdge = true;
          self._pos = self.options.max;

          _hitEdge.call(self);


        }

        // when scroller hits mmaximum, disable scroll and set Transitionable;
        else if (self._pos < self.options.min && self._onEdge === false && self._stopScroll === false) {

          self._onEdge = true;
          self._pos = self.options.min;

          _hitEdge.call(self);

        }

        // update the position of the scroller;

        if (self._onEdge === false && self._stopScroll === false) {

          if (self.options.direction === Utility.Direction.X) {
            self._pos = (self._pos + (ev.delta[0]));
            self._posArray = [self._pos, 0, 0];
          }
          if (self.options.direction === Utility.Direction.Y) {
            self._pos = (self._pos + (ev.delta[1]));
            self._posArray = [0, self._pos, 0];
          }

          self.position.set(self._posArray);

        }

      });

    }

    // set on start, end, update events of sync

    _bindEvents.call(this);

    // check if options was set as an argument and switch out the defaults

    if (options) {
      this.setOptions(options);
    }

  };

  ScrollHandler.DEFAULT_OPTIONS = {
    direction: Utility.Direction.X,
    min: -260,
    max: 20,
    easing: Easing.outElastic
  };

  /**
   * Patches the Scrollview instance's options with the passed-in ones.
   *
   * @method setOptions
   * @param {Options} options An object of configurable options for the Scrollview instance.
   */
  ScrollHandler.prototype.setOptions = function setOptions(options) {
    // preprocess custom options
    if (options.direction !== undefined) {
      if (options.direction === 'x') {
        options.direction = Utility.Direction.X;
      } else if (options.direction === 'y') {
        options.direction = Utility.Direction.Y;
      }
    }

    if (options.easing === undefined) {
      options.easing = Easing.outBounce;
    }

    //TODO: QA check after stateChanges if the position is outside the min and max

    if(this._pos < options.min) {
      this._pos = this.options.min;
    }

    if(this._pos > options.max) {
      this._pos = this.options.max;
    }
    // patch custom options
    this._optionsManager.setOptions(options);

  };

  /**
   * Fetches the current position of the scroller.
   *
   * @method getAbsolutePosition
   */

  ScrollHandler.prototype.getAbsolutePosition = function() {
    return this.position.get();
  };

  /**
   * Sets the position of the scroller.
   *
   * @method setPosition
   * @param position
   */

  ScrollHandler.prototype.setPosition = function(pos,force) {

    if(pos < this.options.min && force === false) {
      pos = this.options.min;
    }

    if(pos > this.options.max && force === false) {
      pos = this.options.max;
    }

    this._pos = pos;

    if (this.options.direction === Utility.Direction.X) {
      this._posArray = [this._pos, 0, 0];
    }
    if (this.options.direction === Utility.Direction.Y) {
      this._posArray = [0, this._pos, 0];
    }

    this.position.set(this._posArray);

  };

  /**
  * Scrolls the scroller automatically.
  *
  * @method setPosition
  * @param position
  */

  ScrollHandler.prototype.scrollTo = function(pos,force) {
    var self = this;

    if(pos < this.options.min && force === false) {
      pos = this.options.min;
    }

    if(pos > this.options.max && force === false) {
      pos = this.options.max;
    }

    this._pos = pos;

    if (this.options.direction === Utility.Direction.X) {
      this._posArray = [this._pos, 0, 0];
    }
    if (this.options.direction === Utility.Direction.Y) {
      this._posArray = [0, this._pos, 0];
    }

    this.position.set(this._posArray, {
      method: 'spring',
      dampingRatio: 0.6,
      period: 600
    }, function() {
      self._onEdge = false;
    });

  };

  module.exports = ScrollHandler;

});
