import config from '../../conf';
import { Component, OnInit, EventEmitter, ElementRef, ChangeDetectorRef} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { ToggleComponent } from '../../components/toggle/toggle.component';
import { SliderComponent } from '../../components/slider/slider.component';
import { DataChannel } from '../../services/data-channel';

declare let module: any;

@Component({
  selector: 'view',
  moduleId: module.id,
  template: `
  
    <ui-button [options]="buttonOptions" 
               (click)="onClick($event)">
      <span *ngIf="!isConnected"> Connect </span>
      <span *ngIf="isConnected"> Connected </span>
      <div *ngIf="isConnecting" class="loading__icon is--small is--center"></div>
    </ui-button>
    
    <ui-toggle [options]="toggleOptions" 
               (click)="onToggle($event)">
      <span *ngIf="!toggleOptions.isActive"> Invert </span>
      <span *ngIf="toggleOptions.isActive"> Default </span>
    </ui-toggle>

    <slider [options]="joyOptions.left"></slider>
    <slider [options]="sliderOptions"></slider>
    <slider [options]="joyOptions.right"></slider>
  `,
  directives: [ SliderComponent, ButtonComponent, ToggleComponent ],
  styleUrls: ['ui-test.component.css']
})

export class UIComponentTest implements OnInit {
  
  sliderOptions: any;
  joyOptions: any;
  buttonOptions: any;
  toggleOptions: any;
  client: any;
  isConnected: boolean;
  isConnecting: boolean;
  isInverted: boolean;
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
        y: window.innerHeight - 280 + 'px'
    };
    
    this.toggleOptions = {
        isActive: false,
        position: 'absolute',
        x: (200) + 'px',
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
