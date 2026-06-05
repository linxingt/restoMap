import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/restaurants/restaurant-list/restaurant-list.component')
                .then(m => m.RestaurantListComponent)
    },
    {
        path: 'restaurants/:slug',
        loadComponent: () =>
            import('./features/restaurants/restaurant-detail/restaurant-detail')
                .then(m => m.RestaurantDetail)
    },
    {
        path: '**',
        redirectTo: ' '
    }
];
