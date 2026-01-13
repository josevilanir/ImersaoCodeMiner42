import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { Home } from './components/home/home.component';
import { CreateRoom } from './components/create-room/create-room.component';
import { JoinRoom } from './components/join-room/join-room.component';
import { Room } from './components/room/room.component';

// Services
import { AuthService } from './services/auth.service';
import { RoomService } from './services/room.service';

// Interceptor funcional
import { jwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    App,
    Login,
    Dashboard,
    Home,
    CreateRoom,
    JoinRoom,
    Room
  ],
  providers: [
    AuthService,
    RoomService,
    provideHttpClient(withInterceptors([jwtInterceptor]))  // 👈 Novo formato
  ]
})
export class AppModule { }