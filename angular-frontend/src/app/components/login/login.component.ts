import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Login implements OnInit { 
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.errorMessage = error.error?.message || 'Usuário ou senha inválidos.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}