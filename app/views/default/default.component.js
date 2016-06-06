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
var Default = (function () {
    function Default(ref) {
        this.isVisible = false;
        this.ref = ref;
    }
    Default.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.isVisible = true;
            _this.ref.detectChanges();
        }, 100);
    };
    Default = __decorate([
        core_1.Component({
            selector: 'view',
            moduleId: module.id,
            template: "\n  \n  <h1>\n    Angular 2 Examples\n  </h1>\n  \n  ",
            styleUrls: ['default.component.css']
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], Default);
    return Default;
}());
exports.Default = Default;
//# sourceMappingURL=default.component.js.map