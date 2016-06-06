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
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';
var default_component_1 = require('./views/default/default.component');
var about_component_1 = require('./views/about/about.component');
var music_player_component_1 = require('./views/music-player/music-player.component');
var ui_test_component_1 = require('./views/ui-test/ui-test.component');
var rtc_client_component_1 = require('./views/rtc-client/rtc-client.component');
var remote_ui_demo_component_1 = require('./views/remote-ui/remote-ui-demo.component');
var synth_component_1 = require('./views/synth/synth.component');
var particle_component_1 = require('./views/particle/particle.component');
var nav_component_1 = require('./components/nav/nav.component');
// console.log(About);
var AppComponent = (function () {
    function AppComponent(router) {
        //console.log(router);
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            template: "\n    <global-nav></global-nav>\n    <div class=\"outer-outlet\">\n      <router-outlet></router-outlet>\n    </div>\n   ",
            directives: [router_1.ROUTER_DIRECTIVES, nav_component_1.GlobalNav],
            moduleId: module.id,
            styleUrls: ['app.component.css']
        }),
        router_1.Routes([
            { path: '/', component: default_component_1.Default },
            { path: '/music', component: music_player_component_1.MusicPlayer },
            { path: '/ui', component: ui_test_component_1.UIComponentTest },
            { path: '/about', component: about_component_1.About },
            { path: '/remote', component: remote_ui_demo_component_1.RemoteUIDemo },
            { path: '/synth', component: synth_component_1.SynthComponent },
            { path: '/webrtc/client', component: rtc_client_component_1.DataChannelClient },
            { path: '/particle', component: particle_component_1.ParticleComponent }
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map