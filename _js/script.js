'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ReactSlider = require('react-slider');

import {ParticleGenerator} from './objects/Particle';
import BufferLoader from './objects/BufferLoader';

let ticker, ALPHA, COLORS, NUM_PARTICLES, SCALE, SIZE, SPEED, SETTINGS, mouse, canvasWidth, canvasHeight;
let particles = [];
let interval = 200;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
let tuna = new Tuna(context);

var chorus = new tuna.Delay({
  feedback: 0.45,    //0 to 1+
  delayTime: 150,    //how many milliseconds should the wet signal be delayed?
  wetLevel: 0.75,    //0 to 1+
  dryLevel: 1,       //0 to 1+
  cutoff: 3000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
  bypass: 0
});

let bufferList;

let buffer = new BufferLoader(context, 'syntklocka_stab', (bufl) => { bufferList = bufl; });

buffer.load();

var startTime = context.currentTime + 0.100;
var tempo = 80; // BPM (beats per minute)
var eighthNoteTime = (60 / tempo) / 2;

const playSound = (buffer, time) => {
  var source = context.createBufferSource();
  source.buffer = buffer;

  source.connect(chorus);
  chorus.connect(context.destination);

  //source.connect(context.destination);

  if (!source.start) {
    source.start = source.noteOn;
  }
  source.start(time);
};

const onTick = () => {
  console.log();
  let sound = Math.floor(map(mouse.y, 0, canvasHeight, 0, 15));
  playSound(bufferList[sound],0);
  particles.forEach((particle) => {
    particle.energy = 1;
  });
};

const changeVal = (val) => {
  chorus.curveAmount = val;
}

const init = () => {
  NUM_PARTICLES = 25;
  SCALE = {MIN: 10, MAX: 10};
  SPEED = {MIN: 0.1, MAX: 0.3};
  ALPHA = {MIN: 0.8, MAX: 0.9};
  SIZE = {MIN: 0.25, MAX: 0.5};
  COLORS =['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];
  SETTINGS = {SCALE, SPEED, ALPHA, SIZE};



ReactDOM.render(
 <ReactSlider min={0} max={1} step={0.01} onChange={changeVal} orientation={'vertical'} />,
  document.getElementById('content')
);





  Sketch.create({
    autopause: false,
    container: document.getElementById('container'),
    setup: function () {
      mouse = this.mouse;
      particles = ParticleGenerator(this, NUM_PARTICLES, SETTINGS, COLORS[0]);
      particles = ParticleGenerator(this, NUM_PARTICLES, SETTINGS, COLORS[0]);

    },
    draw: function () {
      canvasWidth = this.width;
      canvasHeight = this.height;

      this.globalCompositeOperation = 'lighter';
      particles.forEach((particle) => {
        particle.energy = particle.energy * 0.7;
        if (particle.y < -particle.size * particle.level * particle.scale * 2 || particle.y - particle.size * particle.level * particle.scale > this.height + 100) {
          particle.reset();
          particle.x = random(this.width);
          particle.y = random(this.height);
        }
        if (particle.x < -particle.size * particle.level * particle.scale * 2 || particle.x - particle.size * particle.level * particle.scale > this.width + 100) {
          particle.reset();
          particle.x = random(this.width);
          particle.y = random(this.height);
        }
        particle.move();
        particle.draw(this);
      });

    },
    mousedown: function() {
      onTick();
      ticker = setInterval(onTick, interval);
    },
    mouseup: function() {
      clearInterval(ticker);
    }
  });
};

init();




