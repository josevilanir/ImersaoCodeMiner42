import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { AppModule } from './app/app.module';

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),  
    importProvidersFrom(AppModule)
  ]
}).catch(err => console.error(err));