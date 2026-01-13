import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreateRoom implements OnInit {
  private formBuilder = inject(FormBuilder);
  private roomService = inject(RoomService);
  private authService = inject(AuthService);
  private router = inject(Router);

  createForm!: FormGroup;
  loading = false;
  errorMessage = '';

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
        console.log('✅ Sala criada - Resposta completa:', response);
        console.log('✅ Dados:', response.data);
        
        const roomCode = response.data?.room?.code || response.data?.code;
        console.log('✅ Código da sala:', roomCode);
        
        if (!roomCode) {
          console.error('❌ Código da sala não encontrado na resposta!');
          this.errorMessage = 'Erro ao obter código da sala';
          this.loading = false;
          return;
        }
        
        if (response.data?.token) {
          const role = response.data?.hostUser?.role || response.data?.user?.role || 'HOST';
          this.authService.updateToken(response.data.token, role);
          console.log('✅ Token atualizado');
        }
        
        console.log('✅ Navegando para /rooms/' + roomCode);
        this.router.navigate(['/rooms', roomCode]).then(
          () => console.log('✅ Navegação concluída'),
          (err) => console.error('❌ Erro na navegação:', err)
        );
      },
      error: (error) => {
        console.error('❌ Erro ao criar sala:', error);
        this.errorMessage = error.error?.error || 'Erro ao criar sala';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}