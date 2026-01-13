import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { RoomComponent } from './components/room/room.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';

// Services
import { AuthService } from './services/auth.service';
import { RoomService } from './services/room.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    CreateRoomComponent,
    RoomComponent,
    JoinRoomComponent
  ],
  providers: [
    AuthService,
    RoomService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }