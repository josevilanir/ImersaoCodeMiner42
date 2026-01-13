import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { Home } from './components/home/home.component';
import { CreateRoom } from './components/create-room/create-room.component';
import { JoinRoom } from './components/join-room/join-room.component';
import { Room } from './components/room/room.component';
import { authGuard } from './guards/auth.guard';  // 👈 Importar como função

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]  // 👈 Usar como função
  },
  {
    path: 'rooms/create',
    component: CreateRoom,
    canActivate: [authGuard]
  },
  {
    path: 'rooms/join',
    component: JoinRoom,
    canActivate: [authGuard]
  },
  {
    path: 'rooms/:code',
    component: Room,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    redirectTo: '/home',
    pathMatch: 'full'
  },
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