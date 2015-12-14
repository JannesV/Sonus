'use strict';


import {ParticleGenerator} from './objects/Particle';
import SoundParticle, {SoundParticleGenerator} from './objects/SoundParticle';

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

    this.setupSketch();
    this.startTicker();
  }

  playSound(buffer, time) {
    var source = this.context.createBufferSource();
    source.buffer = buffer;

    //source.connect(chorus);
    source.connect(this.context.destination);

    if (!source.start) {
      source.start = source.noteOn;
    }
    source.start(time);
  }

  startTicker() {
    setInterval(() => {
      this.tick++;
      if (this.tick == 9) {
        this.tick = 1;
      }
      //this.panel.setState({activeTick: this.tick});
    }, 200);
  }



  setupSketch() {
    this.draw = Sketch.create({
      autopause: false,
      container: document.getElementById('panel'),
      draw: () => {
        // if(this.drawing) {
        //   if(!this.soundParticles[this.soundParticles.length-1]){
        //     this.soundParticles.push(new SoundParticle(200, this.draw.mouse.y, this.colors[3]));
        //   } else if (this.soundParticles[this.soundParticles.length-1].x < 190){
        //     this.soundParticles.push(new SoundParticle(200, this.draw.mouse.y, this.colors[3]));
        //   }
        // }


        if(this.soundParticles){

          this.soundParticles.forEach((particle) => {
            particle.draw(this.draw);

            if(Math.abs(particle.x - this.draw.mouse.x) <= 5 && this.drawing) {
              particle.y = this.draw.mouse.y;
              particle.energy = 1;
              particle.makeVisible();
            }

            particle.x -= 2;
            if (particle.x < 0) {
              if (particle.alpha > 0) {
                console.log(Math.floor(map(particle.y, 5, 190, 0, 15)));
                this.playSound(this.bufferList[this.sounds[7]][Math.floor(map(particle.y, 0, 200, 0, 15))],0);
                particle.energy = 1;
              }

              particle.x = 600;
            };
          });
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
      container: document.getElementById('container'),
      setup: () => {

      },
      draw: () => {
        this.globalCompositeOperation = 'lighter';
        this.moveParticles(this.particles);
        this.moveParticles(this.bassParticles);
        this.moveParticles(this.tingParticles);
      },
      mousedown: () => {
        console.log('click');
        // onTick();
        // ticker = setInterval(onTick, interval);
        // this.particles.forEach((particle) => {
        //   particle.energy = 1;
        // });
      },
      mouseup: function() {
        //clearInterval(ticker);
      }
    });
    this.particles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[0]);
    this.bassParticles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[1]);
    this.tingParticles = ParticleGenerator(this.sketch, this.numParticles, this.settings, this.colors[3]);

    this.soundParticles = SoundParticleGenerator(this.draw, 600, 100, 50, this.colors[4]);

  }

  pop(particles) {
    particles.forEach((particle) => {
      particle.energy = 1;
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
