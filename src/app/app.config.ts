import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {DBConfig, provideIndexedDb} from 'ngx-indexed-db';
import {databaseConfig} from '@config/db.config';
import { MessageService } from 'primeng/api';

const dbConfig: DBConfig = databaseConfig;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    MessageService,
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideIndexedDb(dbConfig),
    provideAnimationsAsync(),
    providePrimeNG()
  ]
};

