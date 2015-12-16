'use strict';

import {ParticleGenerator} from './objects/Particle';
import {SoundParticleGenerator} from './objects/SoundParticle';



class Sonus {
  constructor(sounds, bufferList) {
    this.sounds = sounds;
    this.context = new AudioContext();
    this.bufferList = bufferList;
    this.numParticles = 25;
    this.scale = {min: 15, max: 25};
    this.alpha = {min: 0.5, max: 0.9};
    this.speed = {min: 0.1, max: 0.3};
    this.colors = ['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423'];
    this.settings = {scale: this.scale, speed: this.speed, alpha: this.alpha};
    this.tick = 0;
    this.drawing = false;
    this.activeSound = 0;
    this.tuna = new Tuna(this.context);

    this.setupSketch();
    document.getElementById('buttons').addEventListener('click', evt => this.buttonListener(evt));
  }

  buttonListener(evt) {

    if (evt.target.className === 'button') {
      this.activeSound = parseInt(evt.target.id);


      let buttons = document.getElementsByClassName('button');
      [].forEach.call(buttons, (button) => {
        button.classList.remove('active');
      });
      evt.target.classList.add('active');
    }
  }

  playSound(buffer, time) {
    let delay = new this.tuna.Delay({
      feedback: 0.45,    //0 to 1+
      delayTime: 150,    //how many milliseconds should the wet signal be delayed?
      wetLevel: 0.25,    //0 to 1+
      dryLevel: 1,       //0 to 1+
      cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
      bypass: 0
    });
    let gainNode = this.context.createGain();
    gainNode.gain.value = 0.7;

    var source = this.context.createBufferSource();
    source.buffer = buffer;


    source.connect(delay);
    delay.connect(this.context.destination);
    gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.2);

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
                particle.y = this.draw.mouse.y;
                particle.energy = 1;
                particle.makeVisible();
              }

              particle.x -= 2;
              if (particle.x < 0) {
                if (particle.alpha > 0) {
                  let sound = Math.floor(map(particle.y, 0, 200, 0, 15));
                  this.playSound(this.bufferList[this.sounds[particle.soundId]][sound], 0);
                  particle.energy = 0.5;
                }
                particle.x = 600;
              }
            });
          };



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
        this.moveParticles(this.bassParticles);
        this.moveParticles(this.tingParticles);
      }
    });
    this.particles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[0]);
    this.bassParticles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[1]);
    this.tingParticles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[3]);

    this.soundParticles = [];
    for (var i = 0; i < 7; i++) {
      this.soundParticles.push(SoundParticleGenerator(this.draw, 600, 100, 40, this.colors[i], i));
    }


  }

  pop(particles) {
    particles.forEach((particle) => {
      particle.energy = random(0.5, 1);
    });
  }

  moveParticles(particles) {
    if (particles && this.sketch) {
      particles.forEach((particle) => {
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


export default Sonus;
