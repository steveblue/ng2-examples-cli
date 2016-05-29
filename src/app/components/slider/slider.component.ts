import {Component, EventEmitter, ElementRef, ChangeDetectorRef, Input, OnInit} from '@angular/core';
import {DraggableDirective} from '../../directives/draggable.directive';

declare let module: any;

@Component({
  selector: 'slider',
  moduleId: module.id,
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.css'],
  directives: [DraggableDirective]
})
export class SliderComponent implements OnInit{
  

  pos: EventEmitter<any>;
  transform: string;
  ref: ChangeDetectorRef;
  elem: any;
  _options: any;
  
 @Input('options') options: any; 
  
  constructor(ref: ChangeDetectorRef, _el: ElementRef) {
    

    this.ref = ref;
    this.elem = _el.nativeElement;
    this.transform = 'translate3d(0px, 0px, 1px)';
    
  }
  
  ngOnInit() {
    
    this._options = {
      position: this.options.position,
      x: this.options.x,
      y: this.options.y
    };
    
    //TODO: Position with matrix3D transform or use web animations api?
    
    if(this._options.position) {
      this.elem.style.position = this._options.position;
    }
    
    if(this._options.x) {
      this.elem.style.left = this._options.x;
    }
    
    if(this._options.y) {
      this.elem.style.top = this._options.y;
    }
    
    this.options.pos = new EventEmitter();
    
    this.options.pos.subscribe((pos)=>{
      this.transform = 'translate3d('+pos[0]+','+pos[1]+','+pos[2]+')';
      this.ref.detectChanges();
    });
  }

}