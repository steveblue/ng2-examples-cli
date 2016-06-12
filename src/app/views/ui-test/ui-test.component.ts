import { Component, OnInit, EventEmitter, ElementRef, ChangeDetectorRef} from '@angular/core';
import { NgClass, Control, ControlGroup, FormBuilder, FORM_PROVIDERS, FORM_DIRECTIVES } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { ToggleComponent } from '../../components/toggle/toggle.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { DataChannel } from '../../services/data-channel';

declare let module: any;

@Component({
  selector: 'view',
  moduleId: module.id,
  templateUrl: 'ui-test.component.html',
  styleUrls: ['ui-test.component.css'],
  providers: [ FORM_PROVIDERS ],
  directives: [ FORM_DIRECTIVES, SliderComponent, ButtonComponent, ToggleComponent ],
})

export class UIComponentTest implements OnInit {
  
  copy: any;
  sliderOptions: any;
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
        min: 12.0,
        max: -12.0,
        currentValue: 0,
        onUpdate: new EventEmitter(),
        position: 'absolute',
        x: (14*2) + 200 + 'px',
        y: window.innerHeight - 214 + 'px'
    };
  
    
    
  }
  ngOnInit() {
    
    // this.client is undefined!
    
      this.form.valueChanges.subscribe((val) => {
          console.log(JSON.stringify(val));
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
  }
  onClick() {
 
    if(!this.isConnected && !this.isButtonDisabled) {

      this.client.room = this.room.value;
      this.client.sendAnnounce();

      this.isConnecting = true;
      
      this.client.emitter.subscribe((message)=>{
        console.log('hello!', message);
           
        if(message === 'open') {
          this.isConnected = true;
          this.isConnecting = false;
          this.client.observer.subscribe((res)=>{

            console.log(res);
            
          });
          
          this.ref.detectChanges();
  
        }

      });

    }
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
  
}
