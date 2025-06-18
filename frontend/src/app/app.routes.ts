import { Routes } from '@angular/router';

import { RoutesConstants } from '@constants/routes.constants';
import { todoDetailsResolver } from '@feat/todo/resolvers/todo-details/todo-details.resolver';
import { signedInGuard } from '@shared/guards/signedin/signed-in-guard';


export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: RoutesConstants.HOME
    },
    {
        path: RoutesConstants.HOME,
        loadComponent: () => import('./features/home/pages/home-page/home-page').then(c => c.HomePage)
    },
    {
        path: RoutesConstants.TODO.LIST,
        loadComponent: () => import('./features/todo/pages/todo-page/todo-page').then(c => c.TodoPage),
        canActivate: [signedInGuard]
    },
    {
        path: RoutesConstants.TODO.DETAILS,
        loadComponent: () => import('./features/todo/pages/todo-details-page/todo-details-page').then(c => c.TodoDetailsPage),
        resolve: {
            todo: todoDetailsResolver
        }
    },
    {
        path: RoutesConstants.LOGIN,
        loadComponent: () => import('./features/auth/pages/login-page/login-page').then(c => c.LoginPage)
    }
];
