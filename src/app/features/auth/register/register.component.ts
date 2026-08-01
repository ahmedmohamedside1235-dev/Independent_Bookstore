import {
  Component,
  computed,
  inject,
  signal,
  output,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public isShowPassword = signal<boolean>(false);
  public isShowPasswordConfirm = signal<boolean>(false);
  public isValidName = signal<boolean>(false);
  public isValidEmail = signal<boolean>(false);
  public isValidPhone = signal<boolean>(false);
  public isEmailUnique = signal<boolean>(true);
  public isShow = input.required<boolean>();
  public isHide = signal<boolean>(false);
  public switchToLogin = output<boolean>();
  public notificationService = inject(NotificationService);

  public confirmPassword = signal<string>('');
  public current_password = signal<string>('');

  public hasMinLength = computed(() => this.current_password().length >= 8);
  public hasUppercase = computed(() => /(?=.*[A-Z])/.test(this.current_password()));
  public hasLowercase = computed(() => /(?=.*[a-z])/.test(this.current_password()));
  public hasDigit = computed(() => /(?=.*\d)/.test(this.current_password()));
  public hasSpecialChar = computed(() => /(?=.*[\W_])/.test(this.current_password()));

  public isPasswordValid = computed(
    () =>
      this.hasMinLength() &&
      this.hasUppercase() &&
      this.hasLowercase() &&
      this.hasDigit() &&
      this.hasSpecialChar(),
  );

  public userService = inject(AuthService);

  public onConfirmPasswordInput(value: string): void {
    this.confirmPassword.set(value);
  }

  public passwordsMatch = computed(
    () => this.confirmPassword().length > 0 && this.confirmPassword() === this.current_password(),
  );

  public toggleIcon(inputName: string): void {
    if (inputName === 'password') {
      this.isShowPassword.set(!this.isShowPassword());
      return;
    }
    this.isShowPasswordConfirm.set(!this.isShowPasswordConfirm());
  }

  public onPasswordInput(value: string): void {
    this.current_password.set(value);
  }

  public isFormValid = computed(
    () =>
      this.isPasswordValid() &&
      this.isValidName() &&
      this.isValidEmail() &&
      this.isValidPhone() &&
      this.isEmailUnique() &&
      this.passwordsMatch(),
  );

  public validateName(value: string) {
    let regex = /^[a-zA-Z]{3,}(\s+[a-zA-Z]{3,}){0,2}$/;
    if (regex.test(value)) {
      this.isValidName.set(true);
      return;
    }
    this.isValidName.set(false);
  }

  public validateEmail(value: string): void {
    let regex = /^[a-zA-Z][\w.]*@(gmail|yahoo)\.(com|org)$/;
    if (!regex.test(value)) {
      this.isValidEmail.set(false);
      this.isEmailUnique.set(true);
      return;
    }
    this.isValidEmail.set(true);
    this.isEmailUnique.set(!this.userService.isSameEmail(value));
  }

  public validatePhone(value: string) {
    let regex = /^(\+20|0)1[0125][0-9]{8}$/;
    if (regex.test(value)) {
      this.isValidPhone.set(true);
      return;
    }
    this.isValidPhone.set(false);
  }

  public validateForm(form: NgForm) {
    if (!this.isFormValid()) return;
    let user = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: this.current_password(),
    };
    this.userService.addUser(user);
    form.reset();
    this.current_password.set('');
    this.confirmPassword.set('');
    this.notificationService.show('Account created successfuly', 'success');
    this.switchRequested();
  }

  public switchRequested(): void {
    this.switchToLogin.emit(!this.isShow());
    this.isHide.set(!this.isHide());
  }
}
