import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app-routing.module';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';  // Importamos HttpClientModule
import { provideToastr} from 'ngx-toastr';
import { provideAnimations} from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es'; 
import { LOCALE_ID } from '@angular/core';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';

registerLocaleData(es);

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideToastr(),
    provideHttpClient(),  
    provideRouter(appRoutes) ,
    NgxPaginationModule  ,
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: NZ_I18N, useValue: es_ES }
  ]
})
  .catch((err) => console.error(err));
