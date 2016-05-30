import config from '../../conf';
import { Component, OnInit, EventEmitter, ElementRef, ChangeDetectorRef} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { DataChannel } from '../../services/data-channel';

declare let module: any;

@Component({
  selector: 'view',
  moduleId: module.id,
  template: `
  
    <ui-button [options]="buttonOptions">
      <span *ngIf="!isConnected"> Connect </span>
      <span *ngIf="isConnected"> Connected </span>
      <div *ngIf="isConnecting" class="loading__icon is--small is--center"></div>
    </ui-button>

    <slider [options]="joyOptions.left"></slider>
    <slider [options]="sliderOptions"></slider>
    <slider [options]="joyOptions.right"></slider>
  `,
  directives: [ SliderComponent, ButtonComponent ],
  styleUrls: ['ui-test.component.css']
})

export class UIComponentTest implements OnInit {
  
  sliderOptions: any;
  joyOptions: any;
  buttonOptions: any;
  client: any;
  isConnected: boolean;
  isConnecting: boolean;
  elem: any;
  ref: any;
  
  constructor(private _el: ElementRef, private _ref: ChangeDetectorRef) {
    
    this.elem = _el.nativeElement;
    this.ref = _ref;

    this.isConnected = false;
    this.isConnecting = false;
    
    this.buttonOptions = {
        position: 'absolute',
        x: (30) + 'px',
        y: window.innerHeight - 280 + 'px',
        onClick: this.onClick.bind(this)
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
        min: [-1.0,1.0],
        max: [1.0,-1.0],
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
    
    console.log(config);
    
    
  }
  ngOnInit() {
    
    // this.client is undefined!
    
    
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
 
    if(!this.isConnected) {

      this.client = new DataChannel(config.room, config.username, config.server);
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
  
}
