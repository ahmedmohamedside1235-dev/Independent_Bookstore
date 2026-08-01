import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
  text: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public message = signal<NotificationMessage | null>(null);
  private hideTimer?: ReturnType<typeof setTimeout>;

  public show(text: string, type: 'success' | 'error' = 'success'): void {
    clearTimeout(this.hideTimer);
    this.message.set({ text, type });
    this.hideTimer = setTimeout(() => this.message.set(null), 3000);
  }
}
