import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = '@MovieNight:token';
  private readonly USER_KEY = '@MovieNight:user';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Realiza login com username e senha
   */
  login(credentials: LoginRequest): Observable<any> { 
    return this.http.post<any>(
      `${environment.apiUrl}/api/v1/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        console.log('✅ Resposta recebida:', response);
      this.setSession(response.data);
    })
  );
}
  /**
   * Realiza logout
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verifica se o token expirou
    return !this.isTokenExpired(token);
  }

  /**
   * Retorna o token JWT armazenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retorna o usuário atual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Salva sessão do usuário
   */
  private setSession(data: { user: User; token: string }): void {  // 👈 Mudei o tipo
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }

  /**
   * Recupera usuário do localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica se o token JWT expirou
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = payload.exp * 1000; // Converter para millisegundos
      return Date.now() >= expirationDate;
    } catch {
      return true;
    }
  }

  /**
 * Atualiza o token e role do usuário
 */
  updateToken(token: string, role: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const user = this.getCurrentUser();
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

}