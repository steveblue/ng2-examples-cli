import { Component, ElementRef, Inject, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AudioService } from '../../services/media-service';
import { WaveformComponent } from '../waveform/waveform.component';

declare let module: any;

@Component({
selector: 'audio-player',
directives: [WaveformComponent],
moduleId: module.id,
templateUrl: 'audio-player.component.html',
styleUrls: ['audio-player.component.css']
})

export class AudioPlayer implements OnInit, OnDestroy {


  audioStream: any;
  elem: HTMLElement;
  audioElem: any;
  sourceNode: MediaElementAudioSourceNode;
  audioService: AudioService;

  @Input() url: string;
  @Input() control: any;
  @Output() onended: any;
  @Output() controls: any;

  constructor(elem: ElementRef, audioService: AudioService) {
     this.elem = elem.nativeElement;
     this.audioService = audioService;
     this.onended = new EventEmitter();
  }

  ngOnInit() {

    this.audioElem = this.elem.querySelector('audio');
    this.sourceNode = this.audioService.ctx.createMediaElementSource(this.audioElem);
    this.audioService.connect(this.sourceNode);

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
    this.audioService.destroy();

  }

  onPlay(ev) {

    this.audioService.process();

  }

  onTrackEnded(ev) {

    this.audioService.stop();
    this.onended.emit();

  }

}
