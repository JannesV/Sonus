'use strict';
class BufferLoader {

  constructor(context, url, callback) {
    this.context = context;
    this.urlList = [];
    for (var i = 1; i <= 16; i++) {
      this.urlList.push(`./assets/${url}_${i}.ogg`);
    }
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
  }

  loadBuffer(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    var loader = this;

    request.onload = () => {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        (buffer) => {
          if (!buffer) {
            console.log(`error decoding file data: ${url}`);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount === loader.urlList.length) {
            loader.onload(loader.bufferList);
          }
        },
        (error) => {
          console.error('decodeAudioData error', error);
        }
      );
    };

    request.onerror = () => {
      console.log('BufferLoader: XHR error');
    };

    request.send();
  }

  load() {
    for (var i = 0; i < this.urlList.length; ++i){
      this.loadBuffer(this.urlList[i], i);
    }
  }
}

export default BufferLoader;



