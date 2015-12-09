'use strict';

class AudioAnalyser {
  constructor(audio, numBands, smoothing) {
    let src;

    this.audio = audio !== null ? audio : new Audio();
    this.numBands = numBands !== null ? numBands : 256;
    this.smoothing = smoothing !== null ? smoothing : 0.3;

    if (typeof this.audio === 'string') {
      src = audio;
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.controls = true;
      this.audio.src = src;
      this.audio.volume = 1.0;
    }

    this.context = new AudioAnalyser.AudioContext();
    this.jsNode = this.context.createScriptProcessor(2048, 1, 1);
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = this.smoothing;
    this.analyser.fftSize = this.numBands * 2;
    this.bands = new Uint8Array(this.analyser.frequencyBinCount);

    console.log(this);

    this.audio.addEventListener('canplay', () => {
      this.source = this.context.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.jsNode);
      this.jsNode.connect(this.context.destination);
      this.source.connect(this.context.destination);
      return this.jsNode.onaudioprocess = () => {
        this.analyser.getByteFrequencyData(this.bands);
        if (!this.audio.paused) {
          return typeof this.onUpdate === 'function' ? this.onUpdate(this.bands) : void 0;
        }
      };
    });

  }

  start() {
    return this.audio.play();
  }
  stop() {
    return this.audio.pause();
  }

}

AudioAnalyser.AudioContext = self.AudioContext || self.webkitAudioContext;
AudioAnalyser.enabled = AudioAnalyser.AudioContext !== null;

export default AudioAnalyser;
