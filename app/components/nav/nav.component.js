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
var router_1 = require('@angular/router');
var GlobalNav = (function () {
    function GlobalNav(router, _ref, _el) {
        this.isVisible = false;
        this.elem = _el.nativeElement;
        this.ref = _ref;
        //console.log('Global Nav!', this.isVisible);
    }
    GlobalNav.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.isVisible = true;
            _this.ref.detectChanges();
            // console.log('Global Nav!', this.isVisible);
        }, 100);
    };
    GlobalNav = __decorate([
        core_1.Component({
            selector: 'global-nav',
            template: "\n    <nav>\n      <ul [class.active]=\"isVisible\">\n        <li class=\"nav__item\" ><a [routerLink]=\"['/']\" >home</a></li>\n        <li class=\"nav__item\" ><a [routerLink]=\"['/ui']\" >ui</a></li>\n        <li class=\"nav__item\" ><a [routerLink]=\"['/music']\" >music</a></li>\n        <li class=\"nav__item\" ><a [routerLink]=\"['/synth']\" >synth</a></li>\n        <li class=\"nav__item\" ><a [routerLink]=\"['/remote']\" >remote</a></li>\n        <li class=\"nav__item\" ><a [routerLink]=\"['/about']\" >about</a></li>\n      </ul>\n    </nav>\n   ",
            directives: [router_1.ROUTER_DIRECTIVES],
            moduleId: module.id,
            styleUrls: ['nav.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, core_1.ChangeDetectorRef, core_1.ElementRef])
    ], GlobalNav);
    return GlobalNav;
}());
exports.GlobalNav = GlobalNav;
//# sourceMappingURL=nav.component.js.map