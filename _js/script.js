'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
// import {$} from './helpers/util';
//import helloworldTpl from '../_hbs/helloworld';
import Particle from './objects/Particle';
import AudioAnalyser from './objects/AudioAnalyser';

const init = () => {
  (function () {
    var ALPHA, COLORS, MP3_PATH, NUM_BANDS, NUM_PARTICLES, SCALE, SIZE, SMOOTHING, SPEED, SPIN, SETTINGS;
    NUM_PARTICLES = 150;
    NUM_BANDS = 256;
    SMOOTHING = 0.2;
    MP3_PATH = './assets/audio.mp3';
    SCALE = {
      MIN: 10,
      MAX: 40
    };
    SPEED = {
      MIN: 0.2,
      MAX: 1
    };
    ALPHA = {
      MIN: 0.8,
      MAX: 0.9
    };
    SPIN = {
      MIN: 0.001,
      MAX: 0.005
    };
    SIZE = {
      MIN: 0.25,
      MAX: 0.5
    };
    COLORS = [
      '#69D2E7',
      '#1B676B',
      '#BEF202',
      '#EBE54D',
      '#00CDAC',
      '#1693A5',
      '#F9D423',
      '#FF4E50',
      '#E7204E',
      '#0CCABA',
      '#FF006F'
    ];
    SETTINGS = {SCALE, SPEED, ALPHA, SPIN, SIZE, COLORS, NUM_BANDS};

    Sketch.create({
      autopause: false,
      particles: [],
      container: document.getElementById('container'),
      setup: function () {
        console.log('setup');
        var analyser, error, i, intro, j, particle, ref, warning, x, y;
        for (i = j = 0, ref = NUM_PARTICLES - 1; j <= ref; i = j += 1) {
          x = random(this.width);
          y = random(this.height * 2);
          particle = new Particle(x, y, SETTINGS);
          particle.energy = random(particle.band / 256);
          this.particles.push(particle);
        }

        try {
          console.log('start');
          analyser = new AudioAnalyser(MP3_PATH, NUM_BANDS, SMOOTHING);

          analyser.onUpdate = (bands) => {
              var k, len, ref1, results;
              ref1 = this.particles;
              results = [];
              for (k = 0, len = ref1.length; k < len; k++) {
                particle = ref1[k];
                results.push(particle.energy = bands[particle.band] / 256);
              }
              return results;
          };

          analyser.start();
          document.body.appendChild(analyser.audio);
          intro = document.getElementById('intro');
          intro.style.display = 'none';
          if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
            warning = document.getElementById('warning2');
            return warning.style.display = 'block';
          }
        } catch (_error) {
          error = _error;
        }
      },
      draw: function () {
        var j, len, particle, ref, results;
        this.globalCompositeOperation = 'lighter';
        ref = this.particles;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {

          particle = ref[j];

          if (particle.y < -particle.size * particle.level * particle.scale * 2 || particle.y - particle.size * particle.level * particle.scale > this.height) {
            particle.reset();
            particle.x = random(this.width);
            particle.y = random(this.height);
          }
          if (particle.x < -particle.size * particle.level * particle.scale * 2 || particle.x - particle.size * particle.level * particle.scale > this.width) {
            particle.reset();
            particle.x = random(this.width);
            particle.y = random(this.height);
          }
          particle.move();
          results.push(particle.draw(this));
        }

        return results;
      }
    });
  }.call(this));
};

init();




