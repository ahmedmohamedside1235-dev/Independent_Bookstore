import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public isShowPassword = signal<boolean>(false);
  public isEmailRequired = signal<boolean>(false);
  public isPasswordRequired = signal<boolean>(false);
  public invalidCredentials = signal<boolean>(false);
  public switchToRegister = output<boolean>();
  public isHide = signal<boolean>(false);
  public isShow = input.required<boolean>();
  public userSrvices = inject(AuthService);
  public toggleIcon(): void {
    this.isShowPassword.set(!this.isShowPassword());
    return;
  }

  public validateForm(form: NgForm) {
    let email = form.value.email?.trim() ?? '',
      password = form.value.password ?? '';

    this.isEmailRequired.set(email === '');
    this.isPasswordRequired.set(password === '');
    if (email === '' || password === '') return;
    let success = this.userSrvices.login(email, password);
    if (!success) {
      this.invalidCredentials.set(true);
      return;
    }
    this.invalidCredentials.set(false);
  }

  public switchRequested() {
    this.switchToRegister.emit(!this.isHide());
    this.isHide.set(!this.isHide());
  }
}
