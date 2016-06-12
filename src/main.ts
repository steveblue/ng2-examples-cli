import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';
import { FORM_PROVIDERS } from '@angular/common';
import { AppComponent, environment } from './app/';

import { DataChannel } from './app/services/data-channel';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  DataChannel,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  FORM_PROVIDERS
  //provide(LocationStrategy, { useClass : HashLocationStrategy })
]);

