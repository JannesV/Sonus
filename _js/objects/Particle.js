'use strict';

class Particle {
  constructor(x1, y1, settings, color) {
    this.scale = settings.scale;
    this.alpha = settings.alpha;
    this.speed = settings.speed;
    this.color = color;
    this.size = settings.size;
    this.x = x1 !== null ? x1 : 0;
    this.y = y1 !== null ? y1 : 0;
    this.reset();
  }

  reset() {
    this.level = 1 + floor(random(4));
    this.scale = random(this.scale.min, this.scale.max);
    this.alpha = random(this.alpha.min, this.alpha.max);
    this.speed = random(this.speed.min, this.speed.max);
    this.color = this.color;
    this.xDir = Math.round(Math.random()) * 2 - 1;
    this.yDir = Math.round(Math.random()) * 2 - 1;
    this.size = random(this.size.min, this.size.max);
    this.smoothedScale = 0;
    this.smoothedAlpha = 0;
    this.decayScale = 0;
    this.decayAlpha = 0;
    return this.energy = 0;
  }

  move() {
    this.x += this.xDir * this.speed * this.level;
    this.y += this.yDir * this.speed * this.level;
  }

  draw(ctx) {
    var alpha, power, scale;
    power = exp(this.energy);
    scale = this.scale * power;
    alpha = this.alpha * this.energy * 1.5;
    this.decayScale = Math.max(this.decayScale, scale);
    this.decayAlpha = Math.max(this.decayAlpha, alpha);
    this.smoothedScale += (this.decayScale - this.smoothedScale) * 0.3;
    this.smoothedAlpha += (this.decayAlpha - this.smoothedAlpha) * 0.3;
    this.decayScale *= 0.985;
    this.decayAlpha *= 0.975;
    ctx.save();
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.smoothedScale * this.level, 0, TWO_PI );
    ctx.fillStyle = this.color;
    ctx.fill();
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
