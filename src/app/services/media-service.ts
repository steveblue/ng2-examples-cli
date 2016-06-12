import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Media } from '../schema/media';
import 'rxjs/add/operator/map';

let emitter = new EventEmitter();

@Injectable()
export class MediaService {
  
  emitter: EventEmitter<any>;
  ctx: AudioContext;
  analyzer: AnalyserNode;
  processor: ScriptProcessorNode;
  sourceNode: MediaElementAudioSourceNode;
  freqData: Uint8Array;

  constructor(public http: Http, @Inject('audioContext') private context) {
    this.http = http;
    this.emitter = emitter;
    this.ctx = context;
    this.analyzer = this.ctx.createAnalyser();
    this.processor = this.ctx.createScriptProcessor(1024);
    this.processor.connect(this.ctx.destination);
    this.analyzer.connect(this.processor);
    this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);
    console.log(this.ctx);
  }

  get() {

    return this.http.get('/app/models/media.json')
    .map((responseData) => {

      return responseData.json().media;

    })
    .map((media: Array<any>) => {

      let result: Array<Media> = [];

      if (media) {

        media.forEach((media) => {
          result.push(
            new Media(media.artist,
              media.title,
              media.url,
              media.imageUrl,
              media.index));
        });

      }

      return result;

    });
  }

  process() {

    let uint8ArrayToArray = function(uint8Array) {
      let array = [];

      for (let i = 0; i < uint8Array.byteLength; i++) {
          array[i] = uint8Array[i];
      }

      return array;
    };

    this.processor.onaudioprocess = (e) => {

        this.analyzer.getByteFrequencyData(this.freqData);
        this.setFrequencyData(uint8ArrayToArray(this.freqData));

    };

  }

  stop() {

    this.processor.onaudioprocess = function() {};

  }

  connect(source) {

    this.sourceNode = source;
    this.sourceNode.connect(this.analyzer);
    this.sourceNode.connect(this.ctx.destination);

  }

  destroy() {

    this.processor.onaudioprocess = function() {};
    this.sourceNode.disconnect();
    this.sourceNode = null;

  }

  setFrequencyData(data) {
    emitter.next(data);
  }

}
