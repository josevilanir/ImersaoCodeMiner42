import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Rota padrão redireciona para login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  
  // Rota de login (pública)
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Rota de dashboard (protegida com AuthGuard)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // <-- Guard protegendo a rota
  },

  // Rota 404 (não encontrada)
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }