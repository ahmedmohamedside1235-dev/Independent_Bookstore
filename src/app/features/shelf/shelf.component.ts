import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShelfStatusComponent } from './shelf-status/shelf-status.component';
import { ShelfUserBooksService } from '../../core/services/bookServices/shelf-user-books.service';
import { ShelfStatus } from '../../core/models/shelfStatus.model';
import { AnimationDirective } from '../../shared/directives/animation.directive';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';


@Component({
  selector: 'app-shelf',
  imports: [RouterLink, ShelfStatusComponent, AnimationDirective],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent {
  public shelf = inject(ShelfUserBooksService);
  public auth = inject(AuthService);
  private routerLinks = inject(Router);
  private notificationService = inject(NotificationService);


  public readonly statusOptions: { value: ShelfStatus; label: string }[] = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'finished', label: 'Finished' }
  ];

  public finishedThisYear = computed(() => {
    const currentYear = new Date().getFullYear();
    return this.shelf
      .finished()
      .filter((i) => new Date(i.updatedAt).getFullYear() === currentYear).length;
  });

  ngOnInit() {
    let user = this.auth.currentUser();

    if (!user) {
      this.notificationService.show('Please log in to explore books.', 'error');
      this.routerLinks.navigate(['/auth']);
      return;
    }
  }

  onStatusChange(event: { bookKey: string; status: ShelfStatus }): void {
    console.log(event);
    this.shelf.updateStatus(event.bookKey, event.status);
  }

  onRemove(bookKey: string): void {
    this.shelf.removeBookFromShelf(bookKey);
  }
}

