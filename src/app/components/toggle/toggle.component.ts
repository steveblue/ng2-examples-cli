import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'ui-toggle',
  templateUrl: 'toggle.component.html',
  styleUrls: ['toggle.component.css']
})
export class ToggleComponent implements OnInit {
  
  elem: any;
    
  @Input() options: any; 
  
  constructor( _el: ElementRef ) {
    this.elem = _el.nativeElement;
  }

  ngOnInit() {
    if(this.options) {
      if(this.options.position) {
        this.elem.style.position = this.options.position;
      }
      
      if(this.options.x) {
        this.elem.style.left = this.options.x;
      }
      
      if(this.options.y) {
        this.elem.style.top = this.options.y;
      }
    }

  }


}
