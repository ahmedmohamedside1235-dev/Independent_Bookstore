import { Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ShelfStatusComponent } from './shelf-status/shelf-status.component';
import { ShelfUserBooksService } from '../../core/services/bookServices/shelf-user-books.service';
import { ShelfStatus } from '../../core/models/shelfStatus.model';
import { AnimationDirective } from '../../shared/directives/animation.directive';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { FlyToCartService } from '../../core/services/bookServices/fly-to-cart.service';


@Component({
  selector: 'app-shelf',
  imports: [RouterLink, ShelfStatusComponent, AnimationDirective],
  templateUrl: './shelf.component.html',
  styleUrl: './shelf.component.scss',
})
export class ShelfComponent {
  public shelf = inject(ShelfUserBooksService);
  public fly = inject(FlyToCartService);
  public auth = inject(AuthService);
  private routerLinks = inject(Router);
  private notificationService = inject(NotificationService);

  private wantToReadCol = viewChild<ElementRef<HTMLElement>>('wantToRead');
  private readingCol = viewChild<ElementRef<HTMLElement>>('reading');
  private finishedCol = viewChild<ElementRef<HTMLElement>>('finished');


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

  // get element reference of the column based on the status
  private getColumn(status: ShelfStatus): HTMLElement | null {
    const columns: Record<ShelfStatus, ElementRef<HTMLElement> | undefined> = {
      'want-to-read': this.wantToReadCol(),
      'reading': this.readingCol(),
      'finished': this.finishedCol(),
    };
    return columns[status]?.nativeElement ?? null;
  }

  onStatusChange(event: { book: any; status: ShelfStatus; img: HTMLImageElement }, startEle: HTMLElement): void {
    let endEle = this.getColumn(event.status);

    this.shelf.removeBookFromShelf(event.book.key);

    if (endEle && endEle !== startEle) {
      this.fly.flyToShelf(event.img, startEle, endEle, () => this.shelf.addOrUpdate(event.book, event.status));
    } else {
      this.shelf.addOrUpdate(event.book, event.status);
    }

  }

  onRemove(bookKey: string): void {
    this.shelf.removeBookFromShelf(bookKey);
  }
}

