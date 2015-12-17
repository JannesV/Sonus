'use strict';


import BufferLoader from './objects/BufferLoader';
import Sonus from './Sonus';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let context = new AudioContext();
// let tuna = new Tuna(context);

// var chorus = new tuna.Delay({
//   feedback: 0.45,    //0 to 1+
//   delayTime: 150,    //how many milliseconds should the wet signal be delayed?
//   wetLevel: 0.75,    //0 to 1+
//   dryLevel: 1,       //0 to 1+
//   cutoff: 3000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
//   bypass: 0
// });

let sounds = ['syntklocka_stab', 'kick', 'clap', 'drums', 'hat', 'woody', 'bit_stab', 'bassdist'];


let bufferList = {};

const loadSounds = () => {
  let loadedSounds = 0;
  sounds.forEach((sound) => {
    let bufferLoader = new BufferLoader(context, sound, (bufl) => {
      bufferList[sound] = bufl;
      loadedSounds++;
      document.getElementById('bar').style.width = `${loadedSounds * 33}px`;

      if (loadedSounds === sounds.length) {
        loadComplete();
      }
    });
    bufferLoader.load();
  });
};

const loadComplete = () => {
  window.sonus = new Sonus(sounds, bufferList);
  setTimeout(() => {
    document.getElementById('loader').classList.add('slideOutDown', 'animated');
  }, 400);

};

// const playSound = (buffer, time) => {
//   var source = context.createBufferSource();
//   source.buffer = buffer;

//   source.connect(chorus);
//   chorus.connect(context.destination);

//   if (!source.start) {
//     source.start = source.noteOn;
//   }
//   source.start(time);
// };

// const onTick = () => {
//   console.log();
//   let sound = 1;
//   sonus.pop(sonus.bassParticles);
//   //playSound(bufferList[sound],0);

// };





window.onload = () => {



  loadSounds();
};





