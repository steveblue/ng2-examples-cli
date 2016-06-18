import { Component, OnInit, EventEmitter, ElementRef, ChangeDetectorRef} from '@angular/core';
import { NgClass, Control, ControlGroup, FormBuilder, FORM_PROVIDERS, FORM_DIRECTIVES } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { ToggleComponent } from '../../components/toggle/toggle.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { WaveformComponent } from '../../components/waveform/waveform.component';
import { NavComponent } from '../../components/ui-nav/nav.component';
import { DataChannel } from '../../services/data-channel';
import { AudioService } from '../../services/media-service';
import { TrackList } from "../../components/track-list/track-list.component";
import { AudioPlayer } from "../../components/audio-player/audio-player.component";
import { Media } from "../../schema/media";
declare let module: any;

@Component({
  selector: 'view',
  moduleId: module.id,
  templateUrl: 'ui-test.component.html',
  styleUrls: ['ui-test.component.css'],
  providers: [ FORM_PROVIDERS, AudioService ],
  directives: [ FORM_DIRECTIVES, SliderComponent, ButtonComponent, ToggleComponent, WaveformComponent, TrackList, AudioPlayer, NavComponent ],
})

export class UIComponentTest implements OnInit {
  
  copy: any;
  sliderOptions: any;
  sliderDistortion: any;
  sliderMultiplier: any;
  sliderHue: any;
  sliderSaturation: any;
  sliderOpacity: any;
  joyOptions: any;
  buttonOptions: any;
  toggleOptions: any;
  client: any;
  isConnected: boolean;
  isConnecting: boolean;
  isButtonDisabled: boolean;
  isInverted: boolean;
  form: ControlGroup;
  room: Control;
  elem: any;
  ref: any;
  controller: EventEmitter<any>;
  message: string;
  tracks: Media[];
  playhead: number;
  currentTrack: any;
  audiocontrol: EventEmitter<any>;
  currentView: string;

  constructor(private _el: ElementRef, 
              private _ref: ChangeDetectorRef,
              private _fb: FormBuilder,
              private _dataChannel: DataChannel) {
    
    this.elem = _el.nativeElement;
    this.ref = _ref;

    this.isConnected = false;
    this.isConnecting = false;
    this.isButtonDisabled = true;

    this.client = _dataChannel;
    
    this.room = new Control('');
    
    this.form = _fb.group({
      'room': this.room
    });
    
    this.copy = {
      headline : 'Remote Control',
      line1: 'Visit /remote on desktop computer to get code'
    };

    this.playhead = 0;
    this.currentTrack = {};
    
    this.controller = new EventEmitter();
    this.audiocontrol = new EventEmitter();
    
    this.toggleOptions = {
        isActive: false,
        position: 'absolute',
        x: (206) + 'px',
        y: window.innerHeight - 280 + 'px'
    };
    
    
    this.joyOptions = {
      left: {
        orient: 'is--joystick',
        min: [-1.0,1.0],
        max: [1.0,-1.0],
        currentValue: [0,0],
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: 14 + 'px',
        y: window.innerHeight - 214 + 'px'
      }, 
      right:  {
        orient: 'is--joystick',
        min: [(window.innerWidth / 2)*-1, (window.innerHeight / 2)*-1],
        max: [(window.innerWidth / 2), (window.innerHeight / 2)],
        currentValue: [0,0],
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: window.innerWidth - 214 + 'px',
        y: window.innerHeight - 214 + 'px'
      }
    };
    
    this.sliderOptions = {
        orient: 'is--vert',
        min: -1000.0,
        max: 1000.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 200 + 'px',
        y: window.innerHeight - 214 + 'px'
    };

    this.sliderDistortion = {
        orient: 'is--vert',
        min: -10.0,
        max: 10.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 250 + 'px',
        y: window.innerHeight - 214 + 'px'
    };


    this.sliderMultiplier = {
        orient: 'is--vert',
        min: 0.0,
        max: 100.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 300 + 'px',
        y: window.innerHeight - 214 + 'px'
    };


    this.sliderHue = {
        orient: 'is--vert',
        min: 0,
        max: 1.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 350 + 'px',
        y: window.innerHeight - 214 + 'px'
    };

    this.sliderSaturation = {
        orient: 'is--vert',
        min: 0,
        max: 1.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 400 + 'px',
        y: window.innerHeight - 214 + 'px'
    };


    this.sliderOpacity = {
        orient: 'is--vert',
        min: 1.0,
        max: 0.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 450 + 'px',
        y: window.innerHeight - 214 + 'px'
    };
  
  
  
  
    this.currentView = 'controls';

    document.ontouchmove = function(e){ 
        e.preventDefault(); 
    };

 
    
  }
  ngOnInit() {
    
    // this.client is undefined!
    
      this.form.valueChanges.subscribe((val) => {
     
         if(val.room.length === 5) {
           this.isButtonDisabled = false;
         } else {
           this.isButtonDisabled = true;
         }
         
      });
    
    
     this.joyOptions.left.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.joyOptions.left.currentValue,
        max: this.joyOptions.left.max,
        min: this.joyOptions.left.min,
        control: 'joyLeft'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });
     
     this.joyOptions.right.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.joyOptions.right.currentValue,
        max: this.joyOptions.right.max,
        min: this.joyOptions.right.min,
        control: 'joyRight'
      });

      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }

     });
     
     this.sliderOptions.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.sliderOptions.currentValue,
        max: this.sliderOptions.max,
        min: this.sliderOptions.min,
        control: 'slider'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });

    this.sliderDistortion.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.sliderDistortion.currentValue,
        max: this.sliderDistortion.max,
        min: this.sliderDistortion.min,
        control: 'distortion'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });

    this.sliderMultiplier.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.sliderMultiplier.currentValue,
        max: this.sliderMultiplier.max,
        min: this.sliderMultiplier.min,
        control: 'multiplier'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });



    this.sliderHue.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.sliderHue.currentValue,
        max: this.sliderHue.max,
        min: this.sliderHue.min,
        control: 'hue'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });


    this.sliderSaturation.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.sliderSaturation.currentValue,
        max: this.sliderSaturation.max,
        min: this.sliderSaturation.min,
        control: 'saturation'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });

    this.sliderOpacity.onUpdate.subscribe((val) => {
      let msg = JSON.stringify({
        currentValue: this.sliderOpacity.currentValue,
        max: this.sliderOpacity.max,
        min: this.sliderOpacity.min,
        control: 'opacity'
      });
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
     });

  }
  onClick() {
 
    if(!this.isConnected && !this.isButtonDisabled) {

      this.client.room = this.room.value;
      this.client.sendAnnounce();

      this.isConnecting = true;


      
      this.client.emitter.subscribe((message)=>{
       // console.log('hello!', message);
           
        if(message === 'open') {
          this.isConnected = true;
          this.isConnecting = false;
          this.currentView = 'controls';
          this.client.observer.subscribe((res)=>{

            let msg = res[res.length-1].data;

            if(msg.control === 'tracklist') {
                this.tracks = msg.tracks;
                this.currentTrack = this.tracks[this.playhead];
            }
          

            if(msg.control === 'waveform') {
                this.controller.emit(msg.currentValue);
            }
          
            
          });
          
          this.ref.detectChanges();
  
        }

      });

    }
  }

	onViewSelect(view: string): void {
    
    console.log(view);
    this.currentView = view;
    
  }
  
  onToggle() {
    this.toggleOptions.isActive = !this.toggleOptions.isActive ? true : false;
    
    let msg = JSON.stringify({
        currentValue: this.toggleOptions.isActive,
        control: 'toggle'
      });
      
      if(this.client && this.client.channel) {
         this.client.channel.send(msg);
      }
      
  }

  onTrackSelected(track: Media): void {
    
    this.playhead = this.tracks.indexOf(track);
    this.currentTrack = this.tracks[this.playhead];

    let msg = JSON.stringify({
        action: 'play',
        control: 'player',
        playhead : this.playhead,
        track: this.currentTrack
      });

    if(this.client && this.client.channel) {
      this.client.channel.send(msg);
       this.audiocontrol.emit({
          action: 'play',
          track: this.currentTrack
        });
    } else {
        this.controller.emit({
          action: 'play',
          track: this.currentTrack
        });
    }

 
    
  }
  prevTrack() {
    
    this.playhead = this.tracks.indexOf(this.currentTrack);
    this.playhead--;
    this.currentTrack = this.tracks[this.playhead];

    let msg = JSON.stringify({
        action: 'prev',
        control: 'player',
        playhead : this.playhead,
        track: this.currentTrack
      });
      
    if(this.client && this.client.channel) {
      this.client.channel.send(msg);
    } else {
      this.controller.emit({
        action: 'play',
        track: this.currentTrack
      });
    }
    
  }
  nextTrack() {
    
    this.playhead = this.tracks.indexOf(this.currentTrack);
    this.playhead++;
    this.currentTrack = this.tracks[this.playhead];
    

    let msg = JSON.stringify({
        action: 'next',
        control: 'player',
        playhead : this.playhead,
        track: this.currentTrack
      });
      
    if(this.client && this.client.channel) {
      this.client.channel.send(msg);
    } else {
      this.controller.emit({
        action: 'play',
        track: this.currentTrack
      });
    }

  }
  
}
