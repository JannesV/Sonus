'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactSlider = require('react-slider');

import {ParticleGenerator} from './objects/Particle';
import BufferLoader from './objects/BufferLoader';

class Sonus {
  constructor() {
    this.numParticles = 25;
    this.scale = {min: 5, max: 10};
    this.speed = {min: 0.1, max: 0.3};
    this.alpha = {min: 0.8, max: 0.9};
    this.size = {min: 0.25, max: 0.5};
    this.colors = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];
    this.settings = {scale: this.scale, speed: this.speed, alpha: this.alpha, size: this.size};

    this.setupSketch();
  }

  setupSketch() {
    this.sketch = Sketch.create({
      autopause: false,
      container: document.getElementById('container'),
      setup:() => {

      },
      draw: () => {
        this.globalCompositeOperation = 'lighter';
        this.moveParticles(this.particles);
      },
      mousedown: function() {
        onTick();
        ticker = setInterval(onTick, interval);
      },
      mouseup: function() {
        clearInterval(ticker);
      }
    });
    this.particles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[0]);
  }

  moveParticles(particles) {
    if (particles && this.sketch) {
      this.particles.forEach((particle) => {
        particle.energy = particle.energy * 0.7;
        if (particle.y < -particle.size * particle.level * particle.scale * 2 || particle.y - particle.size * particle.level * particle.scale > this.sketch.height + 100) {
          particle.reset();
          particle.x = random(this.sketch.width);
          particle.y = random(this.sketch.height);
        }
        if (particle.x < -particle.size * particle.level * particle.scale * 2 || particle.x - particle.size * particle.level * particle.scale > this.sketch.width + 100) {
          particle.reset();
          particle.x = random(this.sketch.width);
          particle.y = random(this.sketch.height);
        }
        particle.move();
        particle.draw(this.sketch);
      });
    }
  }
}

export default Sonus;
