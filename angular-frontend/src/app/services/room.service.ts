import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) {}

  /**
   * Criar nova sala
   */
  createRoom(hostName: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms`, { hostName });
  }

  /**
   * Entrar em sala existente
   */
  joinRoom(roomCode: string, displayName: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/join`, {
      roomCode,
      displayName
    });
  }

  /**
   * Buscar detalhes da sala
   */
  getRoom(code: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/rooms/${code}`);
  }

  /**
   * Buscar sala com polling (atualização automática a cada 3 segundos)
   */
  getRoomWithPolling(code: string): Observable<any> {
    return interval(3000).pipe(
      startWith(0),
      switchMap(() => this.getRoom(code))
    );
  }

  /**
   * Adicionar filme na sala
   */
  addMovie(code: string, title: string, year?: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/${code}/movies`, {
      title,
      year
    });
  }

  /**
   * Deletar filme
   */
  deleteMovie(code: string, movieId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/rooms/${code}/movies/${movieId}`);
  }

  /**
   * Finalizar sala e sortear vencedor (apenas host)
   */
  finishRoom(code: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/${code}/finish`, {});
  }

  /**
   * Transferir ownership da sala
   */
  transferOwnership(code: string, newHostId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/${code}/transfer`, {
      newHostId
    });
  }
}