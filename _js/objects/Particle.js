'use strict';

class Particle {
  constructor(x1, y1, settings, color) {
    this.scaleSetting = settings.scale;
    this.alphaSetting = settings.alpha;
    this.speedSetting = settings.speed;
    this.color = color;
    this.x = x1 !== null ? x1 : 0;
    this.y = y1 !== null ? y1 : 0;
    this.reset();

  }

  reset() {
    this.scale = random(this.scaleSetting.min, this.scaleSetting.max);
    this.alpha = random(this.alphaSetting.min, this.alphaSetting.max);
    this.speed = random(this.speedSetting.min, this.speedSetting.max);
    this.xDir = Math.round(Math.random()) * 2 - 1;
    this.yDir = Math.round(Math.random()) * 2 - 1;
    this.smoothedScale = 0;
    this.smoothedAlpha = 0;
    this.decayScale = 0;
    this.decayAlpha = 0;
    this.energy = 0;
  }

  move() {
    this.x += this.xDir * this.speed;
    this.y += this.yDir * this.speed;
  }

  draw(ctx) {
    var alpha, power, scale;
    power = exp(this.energy);
    scale = this.scale * power;
    alpha = this.alpha * power - 0.5;
    this.decayScale = Math.max(this.decayScale, scale);
    this.decayAlpha = Math.max(this.decayAlpha, alpha);
    this.smoothedScale += (this.decayScale - this.smoothedScale) * 0.3;
    this.smoothedAlpha += (this.decayAlpha - this.smoothedAlpha) * 0.3;
    this.decayScale *= 0.985;
    this.decayAlpha *= 0.975;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.smoothedScale, 0, TWO_PI );
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.smoothedAlpha;
    ctx.fill();
    this.energy *= 0.8;
    return ctx.restore();
  }
}

export const ParticleGenerator = (sketch, numParticles, settings, color) => {
  let particles = [];
  for (var i = 0, ref = numParticles - 1; i <= ref; i+= 1) {
    let x = random(sketch.width);
    let y = random(sketch.height * 2);
    let particle = new Particle(x, y, settings, color);
    particles.push(particle);
  }

  return particles;
};

export default Particle;
