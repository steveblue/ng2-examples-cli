import { Component, provide, OnInit, EventEmitter } from '@angular/core';
import { AudioService } from '../../services/media-service';
import { DataChannel } from '../../services/data-channel';
import { Media } from "../../schema/media";
import { TrackList } from "../../components/track-list/track-list.component";
import { AudioPlayer } from "../../components/audio-player/audio-player.component";

declare let module: any;


@Component({
  selector: 'view',
  moduleId: module.id,
  template: `
  <div class="music__player">
  
    <audio-player
      [url]="currentTrack.url"
      [control]="controller"
      (onended)="nextTrack()">
    </audio-player>
    
    <track-list
      [trackList]="tracks"
      [control]="controller"
      (onselect)="onTrackSelected($event)">
    </track-list>

  </div>
`,
 styleUrls: ['music-player.component.css'],
 directives: [TrackList, AudioPlayer]
})

export class MusicPlayer implements OnInit {
  message: string;
  tracks: Media[];
  playhead: number;
  controller: EventEmitter<any>;
  currentTrack: any;
  client: any;
  
  constructor(public audioService: AudioService, 
              private _dataChannel: DataChannel) {

    this.playhead = 0;
    this.currentTrack = {};
    this.client = _dataChannel;
    this.controller = new EventEmitter();

    this.client.observer.subscribe((res)=>{
         
      let msg = res[res.length-1].data; 
      if(msg.control === 'tracklist') {
        this.tracks = msg.tracks;
        this.currentTrack = msg.currentTrack;
      }

      if(msg.control === 'player') {
        console.log(msg);
        if(msg.action === 'play') {
           this.controller.emit({
            action: 'play',
            track: this.currentTrack
          });
        }
      }

    });

    audioService.get().subscribe(res => {
      this.tracks = res;
      this.currentTrack = this.tracks[this.playhead];
    });

  }
  ngOnInit() {
    
  }
  onTrackSelected(track: Media): void {
    
    this.playhead = this.tracks.indexOf(track);
    this.currentTrack = this.tracks[this.playhead];

    this.controller.emit({
      action: 'play',
      track: this.currentTrack
    });
    
  }
  prevTrack() {
    
    this.playhead = this.tracks.indexOf(this.currentTrack);
    this.playhead--;
    this.currentTrack = this.tracks[this.playhead];
    
    this.controller.emit({
      action: 'play',
      track: this.currentTrack
    });
    
  }
  nextTrack() {
    
    this.playhead = this.tracks.indexOf(this.currentTrack);
    this.playhead++;
    this.currentTrack = this.tracks[this.playhead];
    
    this.controller.emit({
      action: 'play',
      track: this.currentTrack
    });
    
  }
}
