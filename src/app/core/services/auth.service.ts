import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public users: UserModel[] = [];
  public currentUser = signal<UserModel | null>(null);

  constructor() {
    this.loadUsers();
    this.restoreCurrentUser();
  }

  private loadUsers(): void {
    try {
      let raw = localStorage.getItem('users');
      this.users = raw ? JSON.parse(raw) : [];
    } catch {
      this.users = [];
    }
  }

  private restoreCurrentUser(): void {
    let id = localStorage.getItem('currentUserId');

    if (!id) return;

    let user = this.users.find((user) => user.id === id) ?? null;

    this.currentUser.set(user);
  }

  public addUser(userData: any): void {
    let id = new Date().getTime().toString(),
      newUser = { ...userData, id };
    this.users.push(newUser);
    this.saveUser();
  }

  private saveUser() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  public isSameEmail(value: string): boolean {
    return this.users.some((user) => user.email === value);
  }

  public getUser(email: string) {
    return this.users.find((user) => user.email === email);
  }

  public login(email: string, password: string): boolean {
    let user = this.users.find((user) => user.email === email && user.password === password);
    if (!user) return false;
    this.currentUser.set(user);
    localStorage.setItem('currentUserId', user.id);
    return true;
  }

  public logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUserId');
  }
}
