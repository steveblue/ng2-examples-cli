import { Component, provide, Output, ChangeDetectorRef, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

declare let module: any;


@Component({
  selector: 'ui-nav',
  template:`
    <nav>
      <ul [class.active]="isVisible">
        <li class="nav__item" (click)="selectView('controls')">controls</li>
        <li class="nav__item" (click)="selectView('waveform')">waveform</li>
      </ul>
    </nav>
   `,
   directives : [ROUTER_DIRECTIVES],
   moduleId: module.id,
   styleUrls: ['nav.component.css']
})


export class NavComponent implements OnInit {
  isVisible: boolean;
  ref: ChangeDetectorRef;
  elem: any;

  @Output() onselect: EventEmitter<any>;

  constructor(router: Router, _ref: ChangeDetectorRef, _el: ElementRef) {
    this.isVisible = false;
    this.elem = _el.nativeElement;
    this.ref = _ref;
    this.onselect = new EventEmitter();
    //console.log('Global Nav!', this.isVisible);
    
    
  }
  ngOnInit() {

    setTimeout(()=>{

          this.isVisible = true;
          this.ref.detectChanges();
         // console.log('Global Nav!', this.isVisible);

    },100);
  }
  selectView(view:string) {

    this.onselect.emit(view);
  }
  
}
