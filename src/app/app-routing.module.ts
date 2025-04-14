import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';  
import { SucursalesComponent } from './components/sucursales/sucursales.component';  
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },  
  { path: 'sucursales', component: SucursalesComponent , canActivate: [AuthGuard]  }, 
];


