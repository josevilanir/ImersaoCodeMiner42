import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class JoinRoom implements OnInit {
  private formBuilder = inject(FormBuilder);
  private roomService = inject(RoomService);
  private authService = inject(AuthService);
  private router = inject(Router);

  joinForm!: FormGroup;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    
    this.joinForm = this.formBuilder.group({
      roomCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      displayName: [currentUser?.displayName || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.joinForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.joinForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.loading = true;

    const { roomCode, displayName } = this.joinForm.value;

    this.roomService.joinRoom(roomCode.toUpperCase(), displayName).subscribe({
      next: (response) => {
        console.log('Entrou na sala:', response);
        
        if (response.data.token) {
          this.authService.updateToken(response.data.token, response.data.user.role);
        }
        
        this.router.navigate(['/rooms', roomCode.toUpperCase()]);
      },
      error: (error) => {
        console.error('Erro ao entrar na sala:', error);
        this.errorMessage = error.error?.error || 'Sala não encontrada ou código inválido';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  onRoomCodeInput(event: any): void {
    const value = event.target.value.toUpperCase();
    this.joinForm.patchValue({ roomCode: value });
  }
}