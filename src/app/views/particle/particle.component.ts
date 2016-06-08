import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ParticleWorld } from '../../scene/particle.scene';

declare let module: any;

@Component({
  moduleId: module.id,
  selector: 'particle',
  templateUrl: 'particle.component.html',
  styleUrls: ['particle.component.css']
})
export class ParticleComponent implements OnInit {
  
  ref: ChangeDetectorRef;
  elem: any;
  world: any;
  
  constructor(private _ref: ChangeDetectorRef, private _el: ElementRef) {
    this.ref = _ref;
    this.elem = _el.nativeElement;
  }

  ngOnInit() {
    
     this.world = new ParticleWorld(false, false);
     this.world.setContainer(this.elem.querySelector('.scene'));
     this.world.update();
     
  }

}
