import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-auth',
  imports: [RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  public isLogin = signal<boolean>(true);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  public isAuth = signal<UserModel | null>(null);
  public toggleIsLogin() {
    setTimeout(() => {
      this.isLogin.update((bool) => (bool = !bool));
    }, 1000);
  }

  constructor(private router: Router) {
    this.isAuth.set(this.authService.currentUser());
    if (this.isAuth()) {
      router.navigate(['']);
      this.notification.show('You are already login', 'error');
      return;
    }
  }
}
