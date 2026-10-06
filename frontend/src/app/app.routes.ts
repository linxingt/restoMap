import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/restaurants/restaurant-list/restaurant-list.component')
                .then(m => m.RestaurantListComponent)
    },
    {
        path: 'restaurants/detail/:slug/:id',
        loadComponent: () =>
            import('./features/restaurants/restaurant-detail/restaurant-detail')
                .then(m => m.RestaurantDetail)
    },
    {
        path: 'restaurants/new',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/restaurants/restaurant-form/restaurant-form.component')
                .then(m => m.RestaurantFormComponent)
    },
    {
        path: 'restaurants/edit/:slug/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/restaurants/restaurant-form/restaurant-form.component')
                .then(m => m.RestaurantFormComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
