import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { provideLucideConfig, provideLucideIcons, LucideUser, LucideChevronDown, LucideChevronUp, LucideLogOut, LucideLogIn, LucideUserPlus, LucideHeart, LucideFileText } from '@lucide/angular';

import { routes } from './app.routes';
import { interceptor } from './core/interceptors/interceptor';
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideHttpClient(withInterceptors([interceptor])),
    provideLucideIcons(
      LucideUser,
      LucideChevronDown,
      LucideChevronUp,
      LucideLogOut,
      LucideLogIn,
      LucideUserPlus,
      LucideHeart,
      LucideFileText,
    ),
    provideLucideConfig({ size: 12 }),
  ]
};
