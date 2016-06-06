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
var conf_1 = require('../../conf');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var button_component_1 = require('../../components/button/button.component');
var toggle_component_1 = require('../../components/toggle/toggle.component');
var slider_component_1 = require('../../components/slider/slider.component');
var data_channel_1 = require('../../services/data-channel');
var UIComponentTest = (function () {
    function UIComponentTest(_el, _ref, _fb) {
        this._el = _el;
        this._ref = _ref;
        this._fb = _fb;
        this.elem = _el.nativeElement;
        this.ref = _ref;
        this.isConnected = false;
        this.isConnecting = false;
        this.isButtonDisabled = true;
        this.room = new common_1.Control('');
        this.form = _fb.group({
            'room': this.room
        });
        this.copy = {
            headline: 'Remote Control',
            line1: 'Visit /remote on desktop computer to get code'
        };
        this.toggleOptions = {
            isActive: false,
            position: 'absolute',
            x: (206) + 'px',
            y: window.innerHeight - 280 + 'px'
        };
        this.joyOptions = {
            left: {
                orient: 'is--joystick',
                min: [-1.0, 1.0],
                max: [1.0, -1.0],
                currentValue: [0, 0],
                onUpdate: new core_1.EventEmitter(),
                position: 'absolute',
                x: 14 + 'px',
                y: window.innerHeight - 214 + 'px'
            },
            right: {
                orient: 'is--joystick',
                min: [(window.innerWidth / 2) * -1, (window.innerHeight / 2) * -1],
                max: [(window.innerWidth / 2), (window.innerHeight / 2)],
                currentValue: [0, 0],
                onUpdate: new core_1.EventEmitter(),
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
            onUpdate: new core_1.EventEmitter(),
            position: 'absolute',
            x: (14 * 2) + 200 + 'px',
            y: window.innerHeight - 214 + 'px'
        };
        console.log(conf_1.default);
    }
    UIComponentTest.prototype.ngOnInit = function () {
        // this.client is undefined!
        var _this = this;
        this.form.valueChanges.subscribe(function (val) {
            console.log(JSON.stringify(val));
            if (val.room.length === 5) {
                _this.isButtonDisabled = false;
            }
            else {
                _this.isButtonDisabled = true;
            }
        });
        this.joyOptions.left.onUpdate.subscribe(function (val) {
            var msg = JSON.stringify({
                currentValue: _this.joyOptions.left.currentValue,
                max: _this.joyOptions.left.max,
                min: _this.joyOptions.left.min,
                control: 'joyLeft'
            });
            if (_this.client && _this.client.channel) {
                _this.client.channel.send(msg);
            }
        });
        this.joyOptions.right.onUpdate.subscribe(function (val) {
            var msg = JSON.stringify({
                currentValue: _this.joyOptions.right.currentValue,
                max: _this.joyOptions.right.max,
                min: _this.joyOptions.right.min,
                control: 'joyRight'
            });
            if (_this.client && _this.client.channel) {
                _this.client.channel.send(msg);
            }
        });
        this.sliderOptions.onUpdate.subscribe(function (val) {
            var msg = JSON.stringify({
                currentValue: _this.sliderOptions.currentValue,
                max: _this.sliderOptions.max,
                min: _this.sliderOptions.min,
                control: 'slider'
            });
            if (_this.client && _this.client.channel) {
                _this.client.channel.send(msg);
            }
        });
    };
    UIComponentTest.prototype.onClick = function () {
        var _this = this;
        if (!this.isConnected && !this.isButtonDisabled) {
            this.client = new data_channel_1.DataChannel(this.room.value, conf_1.default.username, conf_1.default.server);
            this.isConnecting = true;
            this.client.emitter.subscribe(function (message) {
                console.log('hello!', message);
                if (message === 'open') {
                    _this.isConnected = true;
                    _this.isConnecting = false;
                    _this.client.observer.subscribe(function (res) {
                        console.log(res);
                    });
                    _this.ref.detectChanges();
                }
            });
        }
    };
    UIComponentTest.prototype.onToggle = function () {
        this.toggleOptions.isActive = !this.toggleOptions.isActive ? true : false;
        var msg = JSON.stringify({
            currentValue: this.toggleOptions.isActive,
            control: 'toggle'
        });
        if (this.client && this.client.channel) {
            this.client.channel.send(msg);
        }
    };
    UIComponentTest = __decorate([
        core_1.Component({
            selector: 'view',
            moduleId: module.id,
            templateUrl: 'ui-test.component.html',
            styleUrls: ['ui-test.component.css'],
            providers: [common_1.FORM_PROVIDERS],
            directives: [common_1.FORM_DIRECTIVES, slider_component_1.SliderComponent, button_component_1.ButtonComponent, toggle_component_1.ToggleComponent],
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.ChangeDetectorRef, common_1.FormBuilder])
    ], UIComponentTest);
    return UIComponentTest;
}());
exports.UIComponentTest = UIComponentTest;
//# sourceMappingURL=ui-test.component.js.map