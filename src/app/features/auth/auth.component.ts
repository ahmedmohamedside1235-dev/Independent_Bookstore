import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-auth',
  imports: [RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  public isLogin = signal<boolean>(true);
  public toggleIsLogin() {
    setTimeout(() => {
      this.isLogin.update((bool) => (bool = !bool));
    }, 1000);
  }
  public isSuccess = signal<boolean>(false);
  public showMessage() {
    this.isSuccess.set(!this.isSuccess());
    setTimeout(() => {
      this.isSuccess.set(!this.isSuccess());
    }, 1000);
  }
}
