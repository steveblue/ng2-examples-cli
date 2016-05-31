import { Component, provide, ElementRef } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes } from '@angular/router';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { Default } from './views/default/default.component';
import { About } from './views/about/about.component';
import { MusicPlayer } from './views/music-player/music-player.component';
import { UIComponentTest } from './views/ui-test/ui-test.component';
import { DataChannelClient } from './views/rtc-client/rtc-client.component';
import { RemoteUIDemo } from './views/remote-ui/remote-ui-demo.component';
import { ParticleComponent } from './views/particle/particle.component';
import { GlobalNav } from './components/nav/nav.component';

declare let module: any;

// console.log(About);

@Component({
  selector: 'app',
  template:`
    <global-nav></global-nav>
    <div class="outer-outlet">
      <router-outlet></router-outlet>
    </div>
   `,
   directives : [ROUTER_DIRECTIVES, GlobalNav],
   moduleId: module.id,
   styleUrls: ['app.component.css']
})

@Routes([
  {path:'/', component: Default},
  {path:'/music', component: MusicPlayer},
  {path:'/ui', component: UIComponentTest},
  {path:'/about', component: About},
  {path:'/remote', component: RemoteUIDemo},
  {path:'/webrtc/client', component: DataChannelClient},
  {path:'/particle', component: ParticleComponent}
])

export class AppComponent {
  constructor(router: Router) {
    //console.log(router);
  }
}
