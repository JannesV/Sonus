/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(4);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\n// some features need the be polyfilled..\n// https://babeljs.io/docs/usage/polyfill/\n\n// import 'babel-core/polyfill';\n// or import specific polyfills\n// import {$} from './helpers/util';\n//import helloworldTpl from '../_hbs/helloworld';\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _objectsParticle = __webpack_require__(2);\n\nvar _objectsParticle2 = _interopRequireDefault(_objectsParticle);\n\nvar _objectsAudioAnalyser = __webpack_require__(3);\n\nvar _objectsAudioAnalyser2 = _interopRequireDefault(_objectsAudioAnalyser);\n\nvar init = function init() {\n\n  var ALPHA, COLORS, MP3_PATH, NUM_BANDS, NUM_PARTICLES, SCALE, SIZE, SMOOTHING, SPEED, SPIN, SETTINGS;\n  NUM_PARTICLES = 150;\n  NUM_BANDS = 256;\n  SMOOTHING = 0.2;\n  MP3_PATH = './assets/audio.mp3';\n  SCALE = {\n    MIN: 10,\n    MAX: 10\n  };\n  SPEED = {\n    MIN: 0.1,\n    MAX: 0.3\n  };\n  ALPHA = {\n    MIN: 0.8,\n    MAX: 0.9\n  };\n  SPIN = {\n    MIN: 0.001,\n    MAX: 0.005\n  };\n  SIZE = {\n    MIN: 0.25,\n    MAX: 0.5\n  };\n  COLORS = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];\n  SETTINGS = { SCALE: SCALE, SPEED: SPEED, ALPHA: ALPHA, SPIN: SPIN, SIZE: SIZE, COLORS: COLORS, NUM_BANDS: NUM_BANDS };\n\n  Sketch.create({\n    autopause: false,\n    particles: [],\n    container: document.getElementById('container'),\n    setup: function setup() {\n      var _this = this;\n\n      console.log('setup');\n      var analyser, i, intro, particle, ref, warning, x, y;\n      for (i = 0, ref = NUM_PARTICLES - 1; i <= ref; i += 1) {\n        x = random(this.width);\n        y = random(this.height * 2);\n        particle = new _objectsParticle2['default'](x, y, SETTINGS);\n        particle.energy = random(particle.band / 256);\n        this.particles.push(particle);\n      }\n\n      try {\n        console.log('start');\n        analyser = new _objectsAudioAnalyser2['default'](MP3_PATH, NUM_BANDS, SMOOTHING);\n\n        analyser.onUpdate = function (bands) {\n          var k, len, ref1, results;\n          ref1 = _this.particles;\n          results = [];\n          for (k = 0, len = ref1.length; k < len; k++) {\n            particle = ref1[k];\n            results.push(particle.energy = bands[particle.band] / 256);\n          }\n          return results;\n        };\n\n        analyser.start();\n        document.body.appendChild(analyser.audio);\n        intro = document.getElementById('intro');\n        intro.style.display = 'none';\n        if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {\n          warning = document.getElementById('warning2');\n          return warning.style.display = 'block';\n        }\n      } catch (_error) {\n        console.error(_error);\n      }\n    },\n    draw: function draw() {\n      var j, len, particle, ref, results;\n      this.globalCompositeOperation = 'lighter';\n      ref = this.particles;\n      results = [];\n      for (j = 0, len = ref.length; j < len; j++) {\n\n        particle = ref[j];\n\n        if (particle.y < -particle.size * particle.level * particle.scale * 2 || particle.y - particle.size * particle.level * particle.scale > this.height + 100) {\n          particle.reset();\n          particle.x = random(this.width);\n          particle.y = random(this.height);\n        }\n        if (particle.x < -particle.size * particle.level * particle.scale * 2 || particle.x - particle.size * particle.level * particle.scale > this.width + 100) {\n          particle.reset();\n          particle.x = random(this.width);\n          particle.y = random(this.height);\n        }\n        particle.move();\n        results.push(particle.draw(this));\n      }\n\n      return results;\n    },\n    mousedown: function mousedown() {\n      console.log('down');\n    }\n  });\n};\n\ninit();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }\n\nvar Particle = (function () {\n  function Particle(x1, y1, settings) {\n    _classCallCheck(this, Particle);\n\n    this.SETTINGS = settings;\n    this.x = x1 !== null ? x1 : 0;\n    this.y = y1 !== null ? y1 : 0;\n    this.reset();\n  }\n\n  _createClass(Particle, [{\n    key: 'reset',\n    value: function reset() {\n      this.level = 1 + floor(random(4));\n      this.scale = random(this.SETTINGS.SCALE.MIN, this.SETTINGS.SCALE.MAX);\n      this.alpha = random(this.SETTINGS.ALPHA.MIN, this.SETTINGS.ALPHA.MAX);\n      this.speed = random(this.SETTINGS.SPEED.MIN, this.SETTINGS.SPEED.MAX);\n      this.color = random(this.SETTINGS.COLORS);\n      this.xDir = Math.round(Math.random()) * 2 - 1;\n      this.yDir = Math.round(Math.random()) * 2 - 1;\n      this.size = random(this.SETTINGS.SIZE.MIN, this.SETTINGS.SIZE.MAX);\n      this.spin = random(this.SETTINGS.SPIN.MAX, this.SETTINGS.SPIN.MAX);\n      this.band = floor(random(this.SETTINGS.NUM_BANDS));\n      if (random() < 0.5) {\n        this.spin = -this.spin;\n      }\n      this.smoothedScale = 0;\n      this.smoothedAlpha = 0;\n      this.decayScale = 0;\n      this.decayAlpha = 0;\n      this.rotation = random(TWO_PI);\n      return this.energy = 0;\n    }\n  }, {\n    key: 'move',\n    value: function move() {\n      this.x += this.xDir * this.speed * this.level;\n      this.y += this.yDir * this.speed * this.level;\n    }\n  }, {\n    key: 'draw',\n    value: function draw(ctx) {\n      var alpha, power, scale;\n      power = exp(this.energy);\n      scale = this.scale * power;\n      alpha = this.alpha * this.energy * 1.5;\n      this.decayScale = Math.max(this.decayScale, scale);\n      this.decayAlpha = Math.max(this.decayAlpha, alpha);\n      this.smoothedScale += (this.decayScale - this.smoothedScale) * 0.3;\n      this.smoothedAlpha += (this.decayAlpha - this.smoothedAlpha) * 0.3;\n      this.decayScale *= 0.985;\n      this.decayAlpha *= 0.975;\n      ctx.save();\n      ctx.beginPath();\n      ctx.arc(this.x, this.y, this.smoothedScale * this.level, 0, TWO_PI);\n      ctx.fillStyle = this.color;\n      ctx.fill();\n      return ctx.restore();\n    }\n  }]);\n\n  return Particle;\n})();\n\nexports['default'] = Particle;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/objects/Particle.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/objects/Particle.js?");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }\n\nvar AudioAnalyser = (function () {\n  function AudioAnalyser(audio, numBands, smoothing) {\n    var _this = this;\n\n    _classCallCheck(this, AudioAnalyser);\n\n    var src = undefined;\n\n    this.audio = audio !== null ? audio : new Audio();\n    this.numBands = numBands !== null ? numBands : 256;\n    this.smoothing = smoothing !== null ? smoothing : 0.3;\n\n    if (typeof this.audio === 'string') {\n      src = audio;\n      this.audio = new Audio();\n      this.audio.crossOrigin = 'anonymous';\n      this.audio.controls = true;\n      this.audio.src = src;\n      this.audio.volume = 1.0;\n    }\n\n    this.context = new AudioAnalyser.AudioContext();\n    this.jsNode = this.context.createScriptProcessor(2048, 1, 1);\n    this.analyser = this.context.createAnalyser();\n    this.analyser.smoothingTimeConstant = this.smoothing;\n    this.analyser.fftSize = this.numBands * 2;\n    this.bands = new Uint8Array(this.analyser.frequencyBinCount);\n\n    console.log(this);\n\n    this.audio.addEventListener('canplay', function () {\n      _this.source = _this.context.createMediaElementSource(_this.audio);\n      _this.source.connect(_this.analyser);\n      _this.analyser.connect(_this.jsNode);\n      _this.jsNode.connect(_this.context.destination);\n      _this.source.connect(_this.context.destination);\n      return _this.jsNode.onaudioprocess = function () {\n        _this.analyser.getByteFrequencyData(_this.bands);\n        if (!_this.audio.paused) {\n          return typeof _this.onUpdate === 'function' ? _this.onUpdate(_this.bands) : void 0;\n        }\n      };\n    });\n  }\n\n  _createClass(AudioAnalyser, [{\n    key: 'start',\n    value: function start() {\n      return this.audio.play();\n    }\n  }, {\n    key: 'stop',\n    value: function stop() {\n      return this.audio.pause();\n    }\n  }]);\n\n  return AudioAnalyser;\n})();\n\nAudioAnalyser.AudioContext = self.AudioContext || self.webkitAudioContext;\nAudioAnalyser.enabled = AudioAnalyser.AudioContext !== null;\n\nexports['default'] = AudioAnalyser;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/objects/AudioAnalyser.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/objects/AudioAnalyser.js?");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ }
/******/ ]);