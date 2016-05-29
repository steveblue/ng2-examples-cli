import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'ui-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.css']
})
export class ButtonComponent implements OnInit {
  
  elem: any;
    
  @Input() options: any; 
  
  constructor( _el: ElementRef ) {
    this.elem = _el.nativeElement;
  }

  ngOnInit() {
    
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
  
  onClick(ev) {
    this.options.onClick(ev);
  }

}
