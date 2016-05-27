import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';
import { SynthAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(SynthAppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS//,
  //provide(LocationStrategy, { useClass : HashLocationStrategy })
]);

