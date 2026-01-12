import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // Pega a URL de retorno (se houver)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Se já estiver autenticado, redireciona
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  /**
   * Getter para facilitar acesso aos campos do formulário no template
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Submete o formulário de login
   */
  onSubmit(): void {
  this.errorMessage = '';

  if (this.loginForm.invalid) {
    this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    return;
  }

  this.loading = true;

  console.log('🔵 Enviando login:', this.loginForm.value); // 👈 ADICIONE

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      console.log('✅ Login bem-sucedido!', response); // 👈 JÁ TEM
      this.router.navigate([this.returnUrl]);
    },
    error: (error) => {
      console.error('❌ Erro no login:', error); // 👈 JÁ TEM
      this.errorMessage = error.error?.message || 'Usuário ou senha inválidos.';
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}
}