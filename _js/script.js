'use strict';


import BufferLoader from './objects/BufferLoader';
import Sonus from './Sonus';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let context = new AudioContext();

let socket;

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
  window.sonus = new Sonus(sounds, bufferList, socket);
  setTimeout(() => {
    document.getElementById('loader').classList.add('slideOutDown', 'animated');
  }, 400);

};


window.onload = () => {



  socket = io(`http://localhost:${process.env.PORT || 3000}`);

  socket.on('init', clients => {
    console.log(clients);
  });
  loadSounds();
};





