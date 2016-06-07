import config from '../../conf';
import { Component, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { NgClass, Control, ControlGroup, FormBuilder, FORM_PROVIDERS, FORM_DIRECTIVES } from '@angular/common';
import { DataChannel } from '../../services/data-channel';
import { TerrainWorld } from '../../scene/terrain.scene';
import { ButtonComponent } from '../../components/button/button.component';

declare let module: any;

@Component({
  selector: 'view',
  moduleId: module.id,
  templateUrl: 'remote-ui-demo.component.html',
  styleUrls: ['remote-ui-demo.component.css'],
  providers: [ FORM_PROVIDERS ],
  directives: [ FORM_DIRECTIVES, ButtonComponent ]
})

export class RemoteUIDemo implements OnInit {

  copy: any;
  client: any;
  messages: any;
  isConnected: boolean;
  isConnecting: boolean;
  isButtonDisabled: boolean;
  form: ControlGroup;
  room: Control;
  toggleInvert : number;
  ref: ChangeDetectorRef;
  elem: any;
  world: any;
  
  constructor(private _ref: ChangeDetectorRef,
              private _el: ElementRef,
              private _fb: FormBuilder ) {

    this.ref = _ref;
    this.elem = _el.nativeElement;
    this.messages = [];
    this.isConnected = false;
    this.isConnecting = false;
    this.isButtonDisabled = true;
    this.toggleInvert = 1;
      
    this.copy = {
      headline : 'Remote Terrain',
      line1: 'Visit /ui on a mobile device',
      line2: 'Use this code to connect the controller'
    };
    
    this.room = new Control(config.room);
    
    this.form = _fb.group({
      'room': this.room
    });
    
    console.log(config);

  }
  ngOnInit() {
    
    this.world = new TerrainWorld(true, false);
    this.world.setContainer(this.elem.querySelector('.scene'));
     
    this.form.valueChanges.subscribe((val) => {
         console.log(JSON.stringify(val));
         if(val.room.length === 5) {
           this.isButtonDisabled = false;
         } else {
           this.isButtonDisabled = true;
         }
    });
    
  }
  onKeyDown(ev) {
    

  }
  updateMessages(msg: any) {
    console.log(msg);
    let data : number[] = msg.currentValue;
    
    if(msg.control === 'joyLeft') {
      if(data[0] < 0) {
        console.log('left');
        this.world.controls.moveLeft = true;
        this.world.controls.moveRight = false;
      } else {
        this.world.controls.moveLeft = false;
      }

      if(data[0] > 0) {
        console.log('right');
        this.world.controls.moveLeft = false;
        this.world.controls.moveRight = true;
      } else {
        this.world.controls.moveRight = false;
      }


      if(data[1] > 0) {
        console.log('forward');
        this.world.controls.moveForward = true;
        this.world.controls.moveBackward = false;
      } else {
        this.world.controls.moveForward = false;
      }

      if(data[1] < 0) {
        console.log('backward');
        this.world.controls.moveBackward = true;
        this.world.controls.moveForward = false;
      } else {
        this.world.controls.moveBackward = false;
      }

    }
    
    if(msg.control === 'joyRight') {
        this.world.controls.mouseX = data[0];
        this.world.controls.mouseY = data[1];
    }
    
    if(msg.control === 'slider') {
      
      this.world.camera.position.y = msg.currentValue * this.toggleInvert;
      
    }
    
   if(msg.control === 'toggle') {
      
     this.toggleInvert = this.toggleInvert === 1 ? -1 : 1;
      
    }
    
    this.messages.push(msg);
    this.ref.detectChanges();
  }
  onClick() {

    if(!this.isConnected) {
        
      this.client = new DataChannel(config.room, config.username, config.server);
      this.isConnecting = true;

      this.client.emitter.subscribe((message)=>{

        if(message === 'open') {
          this.isConnected = true;
          this.isConnecting = false;
          this.client.observer.subscribe((res)=>{
         
            let msg = res[res.length-1].data; 
            console.log(msg);
            this.updateMessages(msg);
            
          });
          this.ref.detectChanges();
        }

      });

    }

  }
}
