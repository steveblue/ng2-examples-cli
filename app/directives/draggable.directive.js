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
var DraggableDirective = (function () {
    function DraggableDirective(el) {
        this.el = el;
        this.elem = el.nativeElement;
    }
    DraggableDirective.prototype.onMouseLeave = function () {
        this.isPositionable = false;
    };
    DraggableDirective.prototype.onMouseEnter = function () {
        if (this.isActive) {
            this.isPositionable = true;
        }
    };
    DraggableDirective.prototype.onMouseDown = function (e) {
        e.preventDefault();
        this.isActive = true;
        this.isPositionable = true;
        this.startX = e.clientX - this.elem.offsetLeft;
        this.startY = e.clientY - this.elem.offsetTop;
        if ('ontouchstart' in document.documentElement) {
            this.elem.addEventListener('touchmove', this.onTouchMove.bind(this));
            this.elem.addEventListener('touchend', this.onMouseUp.bind(this));
        }
        else {
            this.elem.addEventListener('mousemove', this.onMouseMove.bind(this));
            this.elem.addEventListener('mouseup', this.onMouseUp.bind(this));
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('mouseup', this.onMouseUp.bind(this));
        }
        if ('ontouchstart' in document.documentElement) {
            e.preventDefault();
            if (this.touchItem === undefined) {
                this.touchItem = e.touches.length - 1; // make this touch = the latest touch in the touches list instead of using event
            }
            this.newX = e.touches[this.touchItem].pageX - this.rect.left - (this.handle.clientWidth / 2);
            this.newY = e.touches[this.touchItem].pageY - this.rect.top - (this.handle.clientWidth / 2);
        }
        else {
            this.newX = e.offsetX;
            this.newY = e.offsetY;
        }
        this.setPosition(this.newX, this.newY);
    };
    // Handle drag event
    DraggableDirective.prototype.onTouchMove = function (e) {
        e.preventDefault();
        if (this.options.orient === 'is--joystick') {
            this.elem.style.cursor = 'url("/assets/ui/slider-control-icon-transparent-cursor.png") 0 0, pointer';
        }
        this.elem.style.border = '1px solid rgba(255,255,255,0.3)';
        this.handle.style.opacity = '0.5';
        if (this.touchItem === undefined) {
            this.touchItem = e.touches.length - 1; // make this touch = the latest touch in the touches list instead of using event
        }
        this.newX = e.touches[this.touchItem].pageX - this.rect.left - 22;
        this.newY = e.touches[this.touchItem].pageY - this.rect.top - 66;
        this.setPosition(this.newX, this.newY);
        if (this.options.orient === 'is--hor') {
            this.options.currentValue = this.scale(this.newX, 0, this.elem.clientWidth - 44, this.options.min, this.options.max);
        }
        else if (this.options.orient === 'is--vert') {
            this.options.currentValue = this.scale(this.newY, 0, this.elem.clientHeight - 44, this.options.min, this.options.max);
        }
        else if (this.options.orient === 'is--joystick') {
            this.options.currentValue = [this.scale(this.newX, 0, this.elem.clientWidth - 44, this.options.min[0], this.options.max[0]),
                this.scale(this.newY, 0, this.elem.clientHeight - 44, this.options.min[1], this.options.max[1])
            ];
        }
        if (this.options.onUpdate) {
            this.options.onUpdate.emit(this.options.currentValue, e.timeStamp);
        }
    };
    DraggableDirective.prototype.onMouseMove = function (e) {
        if (this.options.orient === 'is--joystick') {
            this.elem.style.cursor = 'url("/assets/ui/slider-control-icon-transparent-cursor.png") 0 0, pointer';
        }
        if (this.isActive) {
            this.elem.style.border = '1px solid rgba(255,255,255,0.3)';
            this.handle.style.opacity = '0.5';
            this.newX = e.offsetX;
            this.newY = e.offsetY;
        }
        if (this.isPositionable && this.isActive) {
            this.setPosition(this.newX, this.newY);
            if (this.options.orient === 'is--hor') {
                this.options.currentValue = this.scale(this.newX, 0, this.elem.clientWidth - 44, this.options.min, this.options.max);
            }
            else if (this.options.orient === 'is--vert') {
                this.options.currentValue = this.scale(this.newY, 0, this.elem.clientHeight - 44, this.options.min, this.options.max);
            }
            else if (this.options.orient === 'is--joystick') {
                this.options.currentValue = [this.scale(this.newX, 0, this.elem.clientWidth - 44, this.options.min[0], this.options.max[0]),
                    this.scale(this.newY, 0, this.elem.clientHeight - 44, this.options.min[1], this.options.max[1])
                ];
            }
            if (this.options.onUpdate) {
                this.options.onUpdate.emit(this.options.currentValue, e.timeStamp);
            }
        }
    };
    // Unbind drag events
    DraggableDirective.prototype.onMouseUp = function (e) {
        this.isActive = false;
        this.elem.style.cursor = 'url("/assets/ui/slider-control-icon-transparent-cursor.png") 22 22, pointer';
        this.elem.style.border = '1px solid rgba(255,255,255,0.2)';
        this.handle.style.opacity = '';
        if (this.options.orient === 'is--hor') {
            this.options.currentValue = 0;
        }
        else if (this.options.orient === 'is--vert') {
            this.options.currentValue = 0;
        }
        else if (this.options.orient === 'is--joystick') {
            this.options.currentValue = [0, 0];
        }
        // TODO: set cancel flag? these value just happen to work b/c of current min and max
        if ('ontouchstart' in document.documentElement) {
            this.touchItem = undefined;
        }
        else {
            this.elem.removeEventListener('mousemove', this.onMouseMove.bind(this));
            this.elem.removeEventListener('mouseup', this.onMouseUp.bind(this));
        }
        if (this.options.onUpdate) {
            this.options.onUpdate.emit(this.options.currentValue, e.timeStamp);
        }
    };
    // Get Center of Circle
    DraggableDirective.prototype.getCenter = function (xRange, yRange) {
        var cX = xRange[1] - ((xRange[1] - xRange[0]) / 2);
        var cY = yRange[1] - ((yRange[1] - yRange[0]) / 2);
        return [cX, cY];
    };
    // Distance Between Two Points
    DraggableDirective.prototype.distance = function (dot1, dot2) {
        var x1 = dot1[0], y1 = dot1[1], x2 = dot2[0], y2 = dot2[1];
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };
    // convert between two ranges, for outputting user value
    DraggableDirective.prototype.scale = function (v, min, max, gmin, gmax) {
        return ((v - min) / (max - min)) * (gmax - gmin) + gmin;
    };
    // Find if cursor is within radius of elem
    DraggableDirective.prototype.circularBounds = function (x, y, xRange, yRange) {
        var center = this.getCenter(xRange, yRange);
        var dist = this.distance([x, y], center);
        var radius = xRange[1] - center[0];
        if (dist <= radius) {
            return [x, y];
        }
        else {
            x = x - center[0];
            y = y - center[1];
            var radians = Math.atan2(y, x);
            return [Math.cos(radians) * radius + center[0], Math.sin(radians) * radius + center[1]];
        }
    };
    DraggableDirective.prototype.clamp = function (value, range) {
        return Math.max(Math.min(value, range[1]), range[0]);
    };
    // Move handle, within elem
    DraggableDirective.prototype.setPosition = function (x, y) {
        if (this.options.orient === 'is--joystick') {
            if (x <= 0) {
                this.newX = 0;
            }
            else if (x > this.elem.clientWidth) {
                this.newX = this.elem.clientWidth;
            }
            else {
                this.newX = x;
            }
            if (y <= 0) {
                this.newY = 0;
            }
            else if (y > this.elem.clientWidth) {
                this.newY = this.elem.clientWidth;
            }
            else {
                this.newY = y;
            }
            this.joystickPos = this.circularBounds(this.newX, this.newY, [0, this.elem.clientWidth - this.handle.offsetWidth], [0, this.elem.clientWidth - this.handle.offsetHeight]);
            this.newX = this.clamp(this.joystickPos[0], [0, this.elem.clientWidth - this.handle.offsetWidth]);
            this.newY = this.clamp(this.joystickPos[1], [0, this.elem.clientWidth - this.handle.offsetHeight]);
            //this.options.node.translate = [this.newX, this.newY, 1];
            this.options.pos.emit([this.newX + 'px', this.newY + 'px', 1 + 'px']);
        }
        else {
            if (x <= 0) {
                this.newX = 0;
            }
            else if (x > this.elem.clientWidth - this.handle.offsetWidth) {
                this.newX = this.elem.clientWidth - this.handle.offsetWidth;
            }
            else {
                this.newX = x;
            }
            if (y <= 0) {
                this.newY = 0;
            }
            else if (y > this.elem.clientHeight - this.handle.offsetHeight) {
                this.newY = this.elem.clientHeight - this.handle.offsetHeight;
            }
            else {
                this.newY = y;
            }
            this.options.pos.emit([this.newX + 'px', this.newY + 'px', 1 + 'px']);
        }
    };
    DraggableDirective.prototype.ngOnInit = function () {
        this.handle = this.elem.getElementsByClassName('ui--slider-handle')[0];
        this.height = this.elem.clientHeight;
        this.width = this.elem.clientWidth;
        this.rect = this.elem.getBoundingClientRect(); //TODO: use Ruler Service instead.
        if (this.options.orient === 'is--joystick') {
            this.options.pos.emit(['50%', '50%', '1px']);
        }
        //TODO init based on this.options.currentValue
    };
    __decorate([
        core_1.Input('uiDraggable'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "options", void 0);
    DraggableDirective = __decorate([
        core_1.Directive({
            selector: '[uiDraggable]',
            host: {
                '(mouseleave)': 'onMouseLeave($event)',
                '(mouseenter)': 'onMouseEnter($event)',
                '(mousedown)': 'onMouseDown($event)',
                '(mouseup)': 'onMouseUp($event)',
                '(mousemove)': 'onMouseMove($event)',
                '(touchstart)': 'onMouseDown($event)',
                '(touchend)': 'onMouseUp($event)'
            }
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], DraggableDirective);
    return DraggableDirective;
}());
exports.DraggableDirective = DraggableDirective;
//# sourceMappingURL=draggable.directive.js.map