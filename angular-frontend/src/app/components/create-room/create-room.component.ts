import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateRoomComponent implements OnInit {
  createForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    
    this.createForm = this.formBuilder.group({
      hostName: [currentUser?.displayName || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.createForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.createForm.invalid) {
      this.errorMessage = 'Por favor, preencha seu nome.';
      return;
    }

    this.loading = true;

    this.roomService.createRoom(this.createForm.value.hostName).subscribe({
      next: (response) => {
        console.log('Sala criada:', response);
        const roomCode = response.data.room.code;
        
        // Atualizar token se necessário
        if (response.data.token) {
          this.authService.updateToken(response.data.token, response.data.hostUser.role);
        }
        
        this.router.navigate(['/rooms', roomCode]);
      },
      error: (error) => {
        console.error('Erro ao criar sala:', error);
        this.errorMessage = error.error?.error || 'Erro ao criar sala';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}