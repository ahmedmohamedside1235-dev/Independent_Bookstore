import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShelfStatusComponent } from './shelf-status/shelf-status.component';
import { ShelfUserBooksService } from '../../core/services/bookServices/shelf-user-books.service';
import { ShelfStatus } from '../../core/models/shelfStatus.model';
import { AnimationDirective } from '../../shared/directives/animation.directive';

@Component({
  selector: 'app-shelf',
  imports: [RouterLink, ShelfStatusComponent, AnimationDirective],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent {
  public shelf = inject(ShelfUserBooksService);

  public readonly statusOptions: { value: ShelfStatus; label: string }[] = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'finished', label: 'Finished' }
  ];

  finishedThisYear = computed(() => {
    const currentYear = new Date().getFullYear();
    return this.shelf
      .finished()
      .filter((i) => new Date(i.updatedAt).getFullYear() === currentYear).length;
  });

  onStatusChange(event: { bookKey: string; status: ShelfStatus }): void {
    console.log(event);
    this.shelf.updateStatus(event.bookKey, event.status);
  }

  onRemove(bookKey: string): void {
    this.shelf.removeBookFromShelf(bookKey);
  }
}

