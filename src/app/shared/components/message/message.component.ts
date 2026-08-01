import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-message',
  imports: [NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  public notificationService = inject(NotificationService);
}
