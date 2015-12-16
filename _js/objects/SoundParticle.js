'use strict';

class SoundParticle {
  constructor(x1, y1, color, soundId) {
    this.settings = {scale: this.scale, speed: this.speed, alpha: this.alpha};
    this.scaleSetting = {min: 5, max: 8};
    this.alphaSetting = {min: 0.5, max: 0.9};
    this.soundId = soundId;

    this.color = color;
    this.x = x1 !== null ? x1 : 0;
    this.y = y1 !== null ? y1 : 0;
    this.reset();

  }

  reset() {
    this.scale = random(this.scaleSetting.min, this.scaleSetting.max);
    this.alpha = 0;
    this.smoothedScale = 0;
    this.smoothedAlpha = 0;
    this.decayScale = 0;
    this.decayAlpha = 0;
    this.energy = 0;
  }

  makeVisible() {
    this.alpha = random(this.alphaSetting.min, this.alphaSetting.max);
  }


  draw(ctx) {
    var alpha, power, scale;
    power = exp(this.energy);
    scale = this.scale * power;
    alpha = this.alpha * power;
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

export const SoundParticleGenerator = (sketch, width, yPos, numParticles, color, soundId) => {
  let particles = [];
  for (var i = 0, ref = numParticles - 1; i <= ref; i+= 1) {
    let x = i * width/numParticles;
    let y = yPos;
    let particle = new SoundParticle(x, y, color, soundId);
    particles.push(particle);
  }

  return particles;
};

export default SoundParticle;
