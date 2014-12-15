/* global THREE */
/* jshint ignore:start */
THREE.RuttEtraShader = {

  uniforms: {

    "tDiffuse": { type: "t", value: null },
    "multiplier":  { type: "f", value: 13.3 },
    "displace":  { type: "f", value: 7.3 },
    "opacity":  { type: "f", value: 1.0 },
    "originX":  { type: "f", value: 0.0 },
    "originY":  { type: "f", value: 0.0 },
    "originZ":  { type: "f", value: 0.0 }

  },
  vertexShader: [
    'precision highp int;',
    'precision highp float;',
    'uniform sampler2D tDiffuse;',
    'varying vec3 vColor;',
    'varying vec2 vUv;',
    'uniform float displace;',
    'uniform float multiplier;',
    'uniform float originX;',
    'uniform float originY;',
    'uniform float originZ;',

        'void main() {',
            'vec4 newVertexPos;',
            'vec4 dv;',
            'float df;',
        'vUv = uv;',
        'vec3 origin = vec3 (originX,originY,originZ);',
            'dv = texture2D( tDiffuse, vUv.xy );',
            'df = multiplier*dv.x + multiplier*dv.y + multiplier*dv.z;',
            'newVertexPos = vec4( normalize(position - origin) * df * vec3 (1.0, 1.0, displace), 0.0 ) + vec4( position, 1.0 );',
            'vColor = vec3( dv.x, dv.y, dv.z );',

            'gl_Position = projectionMatrix * modelViewMatrix * newVertexPos;',
        '}'

  ].join("\n"),

  fragmentShader: [

    'varying vec3 vColor;',
    'uniform float opacity;',

      'void main() {',

          'gl_FragColor = vec4( vColor.rgb, opacity );',
      '}'

  ].join("\n")};
  /**
 * @author tapio / http://tapio.github.com/
 *
 * Hue and saturation adjustment
 * https://github.com/evanw/glfx.js
 * hue: -1 to 1 (-1 is 180 degrees in the negative direction, 0 is no change, etc.
 * saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */

THREE.HueSaturationShader = {

  uniforms: {

    "tDiffuse":   { type: "t", value: null },
    "hue":        { type: "f", value: 0 },
    "saturation": { type: "f", value: 0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform float hue;",
    "uniform float saturation;",

    "varying vec2 vUv;",

    "void main() {",

      "gl_FragColor = texture2D( tDiffuse, vUv );",

      // hue
      "float angle = hue * 3.14159265;",
      "float s = sin(angle), c = cos(angle);",
      "vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;",
      "float len = length(gl_FragColor.rgb);",
      "gl_FragColor.rgb = vec3(",
        "dot(gl_FragColor.rgb, weights.xyz),",
        "dot(gl_FragColor.rgb, weights.zxy),",
        "dot(gl_FragColor.rgb, weights.yzx)",
      ");",

      // saturation
      "float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;",
      "if (saturation > 0.0) {",
        "gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));",
      "} else {",
        "gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);",
      "}",

    "}"

  ].join("\n")

};
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Convolution shader
 * ported from o3d sample to WebGL / GLSL
 * http://o3d.googlecode.com/svn/trunk/samples/convolution.html
 */

THREE.ConvolutionShader = {

  defines: {

    "KERNEL_SIZE_FLOAT": "25.0",
    "KERNEL_SIZE_INT": "25",

  },

  uniforms: {

    "tDiffuse":        { type: "t", value: null },
    "uImageIncrement": { type: "v2", value: new THREE.Vector2( 0.001953125, 0.0 ) },
    "cKernel":         { type: "fv1", value: [] }

  },

  vertexShader: [

    "uniform vec2 uImageIncrement;",

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform float cKernel[ KERNEL_SIZE_INT ];",

    "uniform sampler2D tDiffuse;",
    "uniform vec2 uImageIncrement;",

    "varying vec2 vUv;",

    "void main() {",

      "vec2 imageCoord = vUv;",
      "vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );",

      "for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {",

        "sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];",
        "imageCoord += uImageIncrement;",

      "}",

      "gl_FragColor = sum;",

    "}"


  ].join("\n"),

  buildKernel: function ( sigma ) {

    // We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

    function gauss( x, sigma ) {

      return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

    }

    var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

    if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
    halfWidth = ( kernelSize - 1 ) * 0.5;

    values = new Array( kernelSize );
    sum = 0.0;
    for ( i = 0; i < kernelSize; ++i ) {

      values[ i ] = gauss( i - halfWidth, sigma );
      sum += values[ i ];

    }

    // normalize the kernel

    for ( i = 0; i < kernelSize; ++i ) values[ i ] /= sum;

    return values;

  }

};
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

  uniforms: {

    "tDiffuse": { type: "t", value: null },
    "opacity":  { type: "f", value: 1.0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform float opacity;",

    "uniform sampler2D tDiffuse;",

    "varying vec2 vUv;",

    "void main() {",

      "vec4 texel = texture2D( tDiffuse, vUv );",
      "gl_FragColor = opacity * texel;",

    "}"

  ].join("\n")

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

  this.renderer = renderer;

  if ( renderTarget === undefined ) {

    var width = window.innerWidth || 1;
    var height = window.innerHeight || 1;
    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

  }

  this.renderTarget1 = renderTarget;
  this.renderTarget2 = renderTarget.clone();

  this.writeBuffer = this.renderTarget1;
  this.readBuffer = this.renderTarget2;

  this.passes = [];

  if ( THREE.CopyShader === undefined )
    console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

  this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

THREE.EffectComposer.prototype = {

  swapBuffers: function() {

    var tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;

  },

  addPass: function ( pass ) {

    this.passes.push( pass );

  },

  insertPass: function ( pass, index ) {

    this.passes.splice( index, 0, pass );

  },

  render: function ( delta ) {

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

    var maskActive = false;

    var pass, i, il = this.passes.length;

    for ( i = 0; i < il; i ++ ) {

      pass = this.passes[ i ];

      if ( !pass.enabled ) continue;

      pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

      if ( pass.needsSwap ) {

        if ( maskActive ) {

          var context = this.renderer.context;

          context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

          this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

          context.stencilFunc( context.EQUAL, 1, 0xffffffff );

        }

        this.swapBuffers();

      }

      if ( pass instanceof THREE.MaskPass ) {

        maskActive = true;

      } else if ( pass instanceof THREE.ClearMaskPass ) {

        maskActive = false;

      }

    }

  },

  reset: function ( renderTarget ) {

    if ( renderTarget === undefined ) {

      renderTarget = this.renderTarget1.clone();

      renderTarget.width = window.innerWidth;
      renderTarget.height = window.innerHeight;

    }

    this.renderTarget1 = renderTarget;
    this.renderTarget2 = renderTarget.clone();

    this.writeBuffer = this.renderTarget1;
    this.readBuffer = this.renderTarget2;

  },

  setSize: function ( width, height ) {

    var renderTarget = this.renderTarget1.clone();

    renderTarget.width = width;
    renderTarget.height = height;

    this.reset( renderTarget );

  }

};

// shared ortho camera

THREE.EffectComposer.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

THREE.EffectComposer.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), null );

THREE.EffectComposer.scene = new THREE.Scene();
THREE.EffectComposer.scene.add( THREE.EffectComposer.quad );
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

  this.scene = scene;
  this.camera = camera;

  this.overrideMaterial = overrideMaterial;

  this.clearColor = clearColor;
  this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

  this.oldClearColor = new THREE.Color();
  this.oldClearAlpha = 1;

  this.enabled = true;
  this.clear = true;
  this.needsSwap = false;

};

THREE.RenderPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    this.scene.overrideMaterial = this.overrideMaterial;

    if ( this.clearColor ) {

      this.oldClearColor.copy( renderer.getClearColor() );
      this.oldClearAlpha = renderer.getClearAlpha();

      renderer.setClearColor( this.clearColor, this.clearAlpha );

    }

    renderer.render( this.scene, this.camera, readBuffer, this.clear );

    if ( this.clearColor ) {

      renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

    }

    this.scene.overrideMaterial = null;

  }

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

  this.scene = scene;
  this.camera = camera;

  this.enabled = true;
  this.clear = true;
  this.needsSwap = false;

  this.inverse = false;

};

THREE.MaskPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    var context = renderer.context;

    // don't update color or depth

    context.colorMask( false, false, false, false );
    context.depthMask( false );

    // set up stencil

    var writeValue, clearValue;

    if ( this.inverse ) {

      writeValue = 0;
      clearValue = 1;

    } else {

      writeValue = 1;
      clearValue = 0;

    }

    context.enable( context.STENCIL_TEST );
    context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
    context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
    context.clearStencil( clearValue );

    // draw into the stencil buffer

    renderer.render( this.scene, this.camera, readBuffer, this.clear );
    renderer.render( this.scene, this.camera, writeBuffer, this.clear );

    // re-enable update of color and depth

    context.colorMask( true, true, true, true );
    context.depthMask( true );

    // only render where stencil is set to 1

    context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
    context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

  }

};


THREE.ClearMaskPass = function () {

  this.enabled = true;

};

THREE.ClearMaskPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    var context = renderer.context;

    context.disable( context.STENCIL_TEST );

  }

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BloomPass = function ( strength, kernelSize, sigma, resolution ) {

  strength = ( strength !== undefined ) ? strength : 1;
  kernelSize = ( kernelSize !== undefined ) ? kernelSize : 25;
  sigma = ( sigma !== undefined ) ? sigma : 4.0;
  resolution = ( resolution !== undefined ) ? resolution : 256;

  // render targets

  var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };

  this.renderTargetX = new THREE.WebGLRenderTarget( resolution, resolution, pars );
  this.renderTargetY = new THREE.WebGLRenderTarget( resolution, resolution, pars );

  // copy material

  if ( THREE.CopyShader === undefined )
    console.error( "THREE.BloomPass relies on THREE.CopyShader" );

  var copyShader = THREE.CopyShader;

  this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );

  this.copyUniforms[ "opacity" ].value = strength;

  this.materialCopy = new THREE.ShaderMaterial( {

    uniforms: this.copyUniforms,
    vertexShader: copyShader.vertexShader,
    fragmentShader: copyShader.fragmentShader,
    blending: THREE.AdditiveBlending,
    transparent: true

  } );

  // convolution material

  if ( THREE.ConvolutionShader === undefined )
    console.error( "THREE.BloomPass relies on THREE.ConvolutionShader" );

  var convolutionShader = THREE.ConvolutionShader;

  this.convolutionUniforms = THREE.UniformsUtils.clone( convolutionShader.uniforms );

  this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurx;
  this.convolutionUniforms[ "cKernel" ].value = THREE.ConvolutionShader.buildKernel( sigma );

  this.materialConvolution = new THREE.ShaderMaterial( {

    uniforms: this.convolutionUniforms,
    vertexShader:  convolutionShader.vertexShader,
    fragmentShader: convolutionShader.fragmentShader,
    defines: {
      "KERNEL_SIZE_FLOAT": kernelSize.toFixed( 1 ),
      "KERNEL_SIZE_INT": kernelSize.toFixed( 0 )
    }

  } );

  this.enabled = true;
  this.needsSwap = false;
  this.clear = false;

};

THREE.BloomPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

    if ( maskActive ) renderer.context.disable( renderer.context.STENCIL_TEST );

    // Render quad with blured scene into texture (convolution pass 1)

    THREE.EffectComposer.quad.material = this.materialConvolution;

    this.convolutionUniforms[ "tDiffuse" ].value = readBuffer;
    this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurX;

    renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, this.renderTargetX, true );


    // Render quad with blured scene into texture (convolution pass 2)

    this.convolutionUniforms[ "tDiffuse" ].value = this.renderTargetX;
    this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurY;

    renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, this.renderTargetY, true );

    // Render original scene with superimposed blur to texture

    THREE.EffectComposer.quad.material = this.materialCopy;

    this.copyUniforms[ "tDiffuse" ].value = this.renderTargetY;

    if ( maskActive ) renderer.context.enable( renderer.context.STENCIL_TEST );

    renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, readBuffer, this.clear );

  }

};

THREE.BloomPass.blurX = new THREE.Vector2( 0.001953125, 0.0 );
THREE.BloomPass.blurY = new THREE.Vector2( 0.0, 0.001953125 );
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.HueSaturationPass = function ( hue, saturation ) {

  if ( THREE.HueSaturationPass === undefined )
    console.error( "THREE.HueSaturationPass relies on THREE.HueSaturationShader" );

  var shader = THREE.HueSaturationShader;

  this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  if ( hue !== undefined ) this.uniforms[ "hue" ].value = hue;
  if ( saturation !== undefined ) this.uniforms[ "saturation" ].value = saturation;

  this.material = new THREE.ShaderMaterial( {

    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader

  } );

  this.enabled = true;
  this.renderToScreen = false;
  this.needsSwap = true;

};

THREE.HueSaturationPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    this.uniforms[ "tDiffuse" ].value = readBuffer;
    this.uniforms[ "hue" ].value = THREE.HueSaturationPass.hue;
    this.uniforms[ "saturation" ].value = THREE.HueSaturationPass.saturation;
    //this.uniforms[ "tSize" ].value.set( readBuffer.width, readBuffer.height );

    THREE.EffectComposer.quad.material = this.material;

    renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera );


  }

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

  this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

  this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

  this.material = new THREE.ShaderMaterial( {

    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader

  } );

  this.renderToScreen = false;

  this.enabled = true;
  this.needsSwap = true;
  this.clear = false;

};

THREE.ShaderPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    if ( this.uniforms[ this.textureID ] ) {

      this.uniforms[ this.textureID ].value = readBuffer;

    }

    THREE.EffectComposer.quad.material = this.material;

    if ( this.renderToScreen ) {

      renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera );

    } else {

      renderer.render( THREE.EffectComposer.scene, THREE.EffectComposer.camera, writeBuffer, this.clear );

    }

  }

};
/* jshint ignore:end */