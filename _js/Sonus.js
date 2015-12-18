'use strict';

import userTpl from '../_hbs/user';
import {ParticleGenerator} from './objects/Particle';
import {SoundParticleGenerator} from './objects/SoundParticle';
import {
    html, $
}
from './helpers/util';
//import Recorder from './objects/Recorder';



class Sonus {
  constructor(sounds, bufferList, socket) {
    this.sounds = sounds;
    this.context = new AudioContext();
    this.socket = socket;
    this.bufferList = bufferList;
    this.numParticles = 25;
    this.drawingMode = 'pencil';
    this.scale = {min: 15, max: 25};
    this.alpha = {min: 0.5, max: 0.9};
    this.speed = {min: 0.1, max: 0.3};
    this.colors = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];
    this.settings = {scale: this.scale, speed: this.speed, alpha: this.alpha};
    this.tick = 0;
    this.drawing = false;
    this.activeSound = 0;

    this.setupSocket();
    this.filterSetup();
    this.setupSketch();

    document.getElementById('buttons').addEventListener('click', evt => this.buttonListener(evt));
    document.getElementById('eq').addEventListener('click', evt => this.eqListener(evt));
    document.getElementById('pencil').addEventListener('click', evt => this.pencilListener(evt));
    document.getElementById('eraser').addEventListener('click', evt => this.eraserListener(evt));
    document.getElementById('trash').addEventListener('click', evt => this.trashListener(evt));
    document.getElementById('gain').addEventListener('input', evt => this.gainListener(evt));
    document.getElementById('delay').addEventListener('input', evt => this.delayListener(evt));
  }

  setupSocket() {

    let $users = $('.users');

    this.socket.on('init', clients => {


      clients.forEach(client => {

        let $user = html(userTpl(client));


        $user.querySelector('.button').addEventListener('click', e => {
          e.preventDefault();
          this.socket.emit('yo', {
            mySocketid: this.socket.id,
            targetSocketid: e.currentTarget.parentNode.dataset.socketid
          });

        });

        $users.appendChild($user);

      });

    });

    this.socket.on('user_joined', client => {
      let $el = html(userTpl(client));



      $users.appendChild($el);
    });

    this.socket.on('user_disconnect', socketid => {
      let $el = $('[data-socketid="'+socketid+'"]');
      $el.parentNode.removeChild($el);
    });
  }

  filterSetup() {
    let tuna = new Tuna(this.context);

    this.filters = {syntklocka_stab: {}, kick: {}, clap: {}, drums: {}, hat: {}, woody: {}, bit_stab: {}, bassdist: {}};

    for(var key in this.filters) {
      this.filters[key].gain = this.context.createGain();
      this.filters[key].phaser = new tuna.Phaser({
        rate: 3,                     //0.01 to 8 is a decent range, but higher values are possible
        depth: 0.3,                    //0 to 1
        feedback: 0.2,                 //0 to 1+
        stereoPhase: 30,               //0 to 180
        baseModulationFrequency: 700,  //500 to 1500
        bypass: 0
      });
      this.filters[key].delay = new tuna.Delay({
        feedback: 0.45,    //0 to 1+
        delayTime: 150,    //how many milliseconds should the wet signal be delayed?
        wetLevel: 0.25,    //0 to 1+
        dryLevel: 1,       //0 to 1+
        cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
        bypass: 0
      });
    }
  }

  eqListener() {
    document.getElementById('eqpanel').classList.toggle('closed');
  }

  trashListener() {
    this.soundParticles[this.activeSound].forEach(particle => {
      particle.alpha = 0;
    });
  }

  pencilListener() {
    document.getElementById('pencil').classList.add('active');
    document.getElementById('eraser').classList.remove('active');
    this.drawingMode = 'pencil';
  }

  eraserListener() {
    document.getElementById('pencil').classList.remove('active');
    document.getElementById('eraser').classList.add('active');
    this.drawingMode = 'eraser';
  }

  gainListener(evt) {
    this.filters[this.sounds[this.activeSound]].gain.gain.value = evt.target.value;
  }

  delayListener(evt) {
    this.filters[this.sounds[this.activeSound]].delay.wetLevel.value = evt.target.value;
  }

  buttonListener(evt) {
    if (evt.target.className === 'button') {
      this.activeSound = parseInt(evt.target.id);

      document.getElementById('gain').value = this.filters[this.sounds[this.activeSound]].gain.gain.value;
      document.getElementById('delay').value = this.filters[this.sounds[this.activeSound]].delay.wetLevel.value;


      let buttons = document.getElementsByClassName('button');
      [].forEach.call(buttons, (button) => {
        button.classList.remove('active');
      });
      evt.target.classList.add('active');
    }
  }

  playSound(soundId, sound, time) {
    let buffer = this.bufferList[soundId][sound];
    let filters = this.filters[soundId];

    var source = this.context.createBufferSource();
    source.buffer = buffer;


    source.connect(filters.delay);
    filters.delay.connect(filters.phaser);
    filters.phaser.connect(filters.gain);
    filters.gain.connect(this.context.destination);

    if (!source.start) {
      source.start = source.noteOn;
    }
    source.start(time);
  }

  setupSketch() {
    this.draw = Sketch.create({
      autopause: false,
      container: document.getElementById('canvas'),
      draw: () => {
        if(this.soundParticles){
          for (var i = this.soundParticles.length - 1; i >= 0; i--) {
            this.soundParticles[i].forEach((particle) => {
              particle.draw(this.draw);

              if(Math.abs(particle.x - this.draw.mouse.x) <= 3 && this.drawing && this.activeSound === i) {
                console.log(this.drawingMode);
                if (this.drawingMode === 'pencil') {
                  particle.y = this.draw.mouse.y;
                  particle.energy = 1;
                  particle.makeVisible();
                } else {
                  particle.alpha = 0;
                }

              }

              particle.x -= 2;
              if (particle.x < 0) {
                if (particle.alpha > 0) {
                  let sound = Math.floor(map(particle.y, 0, 200, 0, 15));
                  this.playSound(this.sounds[particle.soundId], sound, 0);
                  this.pop(this.particles[particle.soundId]);
                  particle.energy = 0.5;
                }
                particle.x = 600;
              }
            });
          }
        }

      },
      mousedown: () => {
        this.drawing = true;
      },
      mouseup: () => {
        this.drawing = false;
      }
    });

    this.sketch = Sketch.create({
      autopause: false,
      container: document.getElementById('visual'),
      setup: () => {

      },
      draw: () => {
        this.globalCompositeOperation = 'lighter';
        this.moveParticles(this.particles);
      }
    });

    this.particles = [];
    this.soundParticles = [];
    for (var i = 0; i < 7; i++) {
      this.soundParticles.push(SoundParticleGenerator(this.draw, 600, 100, 40, this.colors[i], i));
      this.particles.push(ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[i]));
    }


  }

  pop(particles) {
    particles.forEach((particle) => {
      particle.energy = random(0.5, 1);
    });
  }

  moveParticles(particles) {
    if (particles && this.sketch) {
      for (var i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].forEach((particle) => {
          // particle.energy = particle.energy * 0.7;
          if (particle.y < -particle.scale * 2 || particle.y + particle.scale * 2 > this.sketch.height + 100) {
            particle.reset();
            particle.x = random(this.sketch.width);
            particle.y = random(this.sketch.height);
          }
          if (particle.x < -particle.scale * 2 || particle.x + particle.scale * 2 > this.sketch.width + 100) {
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
}


export default Sonus;
