"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var draggable_directive_1 = require('../../directives/draggable.directive');
var SliderComponent = (function () {
    function SliderComponent(ref, _el) {
        this.ref = ref;
        this.elem = _el.nativeElement;
        this.transform = 'translate3d(0px, 0px, 1px)';
    }
    SliderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._options = {
            position: this.options.position,
            x: this.options.x,
            y: this.options.y
        };
        //TODO: Position with matrix3D transform or use web animations api?
        if (this._options.position) {
            this.elem.style.position = this._options.position;
        }
        if (this._options.x) {
            this.elem.style.left = this._options.x;
        }
        if (this._options.y) {
            this.elem.style.top = this._options.y;
        }
        this.options.pos = new core_1.EventEmitter();
        this.options.pos.subscribe(function (pos) {
            _this.transform = 'translate3d(' + pos[0] + ',' + pos[1] + ',' + pos[2] + ')';
            _this.ref.detectChanges();
        });
    };
    __decorate([
        core_1.Input('options'), 
        __metadata('design:type', Object)
    ], SliderComponent.prototype, "options", void 0);
    SliderComponent = __decorate([
        core_1.Component({
            selector: 'slider',
            moduleId: module.id,
            templateUrl: 'slider.component.html',
            styleUrls: ['slider.component.css'],
            directives: [draggable_directive_1.DraggableDirective]
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef, core_1.ElementRef])
    ], SliderComponent);
    return SliderComponent;
}());
exports.SliderComponent = SliderComponent;
//# sourceMappingURL=slider.component.js.map