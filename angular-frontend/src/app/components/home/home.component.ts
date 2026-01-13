import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class Home implements OnInit { 
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: any = null;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  goToCreateRoom(): void {
    this.router.navigate(['/rooms/create']);
  }

  goToJoinRoom(): void {
    this.router.navigate(['/rooms/join']);
  }

  logout(): void {
    this.authService.logout();
  }
}