'use strict';

class Particle {

  constructor(x1, y1, settings) {
    this.SETTINGS = settings;
    this.x = x1 !== null ? x1 : 0;
    this.y = y1 !== null ? y1 : 0;
    this.reset();
  }

  reset() {
    this.level = 1 + floor(random(4));
    this.scale = random(this.SETTINGS.SCALE.MIN, this.SETTINGS.SCALE.MAX);
    this.alpha = random(this.SETTINGS.ALPHA.MIN, this.SETTINGS.ALPHA.MAX);
    this.speed = random(this.SETTINGS.SPEED.MIN, this.SETTINGS.SPEED.MAX);
    this.color = random(this.SETTINGS.COLORS);
    this.xDir = Math.round(Math.random()) * 2 - 1;
    this.yDir = Math.round(Math.random()) * 2 - 1;
    this.size = random(this.SETTINGS.SIZE.MIN, this.SETTINGS.SIZE.MAX);
    this.spin = random(this.SETTINGS.SPIN.MAX, this.SETTINGS.SPIN.MAX);
    this.band = floor(random(this.SETTINGS.NUM_BANDS));
    if (random() < 0.5) {
      this.spin = -this.spin;
    }
    this.smoothedScale = 0;
    this.smoothedAlpha = 0;
    this.decayScale = 0;
    this.decayAlpha = 0;
    this.rotation = random(TWO_PI);
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

export default Particle;
