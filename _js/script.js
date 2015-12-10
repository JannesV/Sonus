'use strict';


import BufferLoader from './objects/BufferLoader';
import Sonus from './Sonus';

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



const init = () => {
  let sonus = new Sonus();
};

init();




