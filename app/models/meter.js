"use strict";
var Meter = (function () {
    function Meter(height, i) {
        this.height = height;
        this.i = i;
        this.position = {
            x: 0,
            y: 0
        };
        this.val = 0;
        this.isVisible = false;
        this.index = i;
        this.tooltip = {
            x: 6,
            y: 8,
            width: 60,
            height: 12,
            fill: 'rgba(255,255,255,0.3)'
        };
        this.level = {
            color: 'rgba(255,255,255,1.0)',
            stroke: 6,
            val: 0,
            points: [{
                    x: 0,
                    y: height
                },
                {
                    x: 0,
                    y: height
                }]
        };
        this.playhead = {
            color: 'rgba(255,255,255,0.7)',
            stroke: 6,
            points: [{
                    x: 0,
                    y: 0
                },
                {
                    x: 0,
                    y: height
                }]
        };
    }
    ;
    return Meter;
}());
exports.Meter = Meter;
//# sourceMappingURL=meter.js.map