import { Component, ElementRef, Inject, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MediaService } from '../../services/media-service';
import { WaveformComponent } from '../waveform/waveform.component';

declare let module: any;

@Component({
selector: 'audio-player',
template: `
  <audio controls src="{{url}}" type="audio/mpeg"
  (play)="onPlay($event)"
  (ended)="onTrackEnded($event)">
  </audio>
  <waveform-monitor></waveform-monitor>
`,
directives: [WaveformComponent],
moduleId: module.id,
styleUrls: ['audio-player.component.css']

})

export class AudioPlayer implements OnInit, OnDestroy {


  audioStream: any;
  elem: HTMLElement;
  audioElem: any;
  sourceNode: MediaElementAudioSourceNode;
  mediaService: MediaService;

  @Input() url: string;
  @Input() control: any;
  @Output() onended: any;
  @Output() controls: any;

  constructor(elem: ElementRef, mediaService: MediaService) {
     this.elem = elem.nativeElement;
     this.mediaService = mediaService;
     this.onended = new EventEmitter();
  }

  ngOnInit() {

    this.audioElem = this.elem.querySelector('audio');
    this.sourceNode = this.mediaService.ctx.createMediaElementSource(this.audioElem);
    this.mediaService.connect(this.sourceNode);

    this.control.subscribe((control)=>{
      if(control.action === 'play') {
        this.audioElem.play();
      }
      if(control.action === 'pause') {
        this.audioElem.pause();
      }
    });

  }

  ngOnDestroy() {

    // this.processor.onaudioprocess = function() {};
    // this.sourceNode.disconnect();
    // this.sourceNode = null;
    this.mediaService.destroy();

  }

  onPlay(ev) {

    this.mediaService.process();

  }

  onTrackEnded(ev) {

    this.mediaService.stop();
    this.onended.emit();

  }

}
