import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RoomComponent implements OnInit, OnDestroy {
  roomCode: string = '';
  room: any = null;
  loading = true;
  error = '';
  
  movieForm!: FormGroup;
  addingMovie = false;
  finishing = false;
  deletingMovieId: string | null = null;
  
  private pollingSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.roomCode = this.route.snapshot.params['code'];
    
    this.movieForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      year: ['', [Validators.min(1900), Validators.max(2030)]]
    });

    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  get f() {
    return this.movieForm.controls;
  }

  get isHost(): boolean {
    return this.room?.currentUser?.role === 'HOST';
  }

  get isFinished(): boolean {
    return this.room?.room?.status === 'FINISHED';
  }

  startPolling(): void {
    this.pollingSubscription = this.roomService.getRoomWithPolling(this.roomCode).subscribe({
      next: (response) => {
        this.room = response.data;
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
        console.error('Erro ao buscar sala:', error);
        this.error = 'Erro ao carregar sala';
        this.loading = false;
      }
    });
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  onAddMovie(): void {
    if (this.movieForm.invalid) {
      return;
    }

    this.addingMovie = true;
    const { title, year } = this.movieForm.value;

    this.roomService.addMovie(this.roomCode, title, year || undefined).subscribe({
      next: (response) => {
        console.log('Filme adicionado:', response);
        this.movieForm.reset();
        this.addingMovie = false;
      },
      error: (error) => {
        console.error('Erro ao adicionar filme:', error);
        alert('Erro ao adicionar filme');
        this.addingMovie = false;
      }
    });
  }

  onDeleteMovie(movieId: string): void {
    if (!confirm('Deseja realmente remover este filme?')) {
      return;
    }

    this.deletingMovieId = movieId;

    this.roomService.deleteMovie(this.roomCode, movieId).subscribe({
      next: () => {
        console.log('Filme removido');
        this.deletingMovieId = null;
      },
      error: (error) => {
        console.error('Erro ao remover filme:', error);
        alert('Erro ao remover filme');
        this.deletingMovieId = null;
      }
    });
  }

  onFinishRoom(): void {
    if (!confirm('Deseja finalizar a sala e sortear o filme vencedor?')) {
      return;
    }

    this.finishing = true;

    this.roomService.finishRoom(this.roomCode).subscribe({
      next: (response) => {
        console.log('Sala finalizada:', response);
        this.finishing = false;
      },
      error: (error) => {
        console.error('Erro ao finalizar sala:', error);
        alert(error.error?.error || 'Erro ao finalizar sala');
        this.finishing = false;
      }
    });
  }

  copyRoomCode(): void {
    navigator.clipboard.writeText(this.roomCode).then(() => {
      alert('Código copiado!');
    });
  }

  leaveRoom(): void {
    if (confirm('Deseja realmente sair da sala?')) {
      this.router.navigate(['/home']);
    }
  }
}