import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { BookService } from '../../core/services/bookServices/book.service';
import { ActivatedRoute } from '@angular/router';
import { loadingComponent } from '../../shared/components/loading/loading.component';
import { EditDescriptionPipe } from '../../shared/pipe/edit-description-pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { BookReaderComponent } from '../../shared/components/book-reader/book-reader.component';
import { ShelfUserBooksService } from '../../core/services/bookServices/shelf-user-books.service';
import { NgClass } from '@angular/common';
import { ShelfStatus } from '../../core/models/shelfStatus.model';
import { NotificationService } from '../../core/services/notification.service';
import { CleanDescriptionPipe } from '../../shared/pipe/clean-description-pipe';
import { FlyToCartService } from '../../core/services/bookServices/fly-to-cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-book-details',
  imports: [loadingComponent, EditDescriptionPipe, BookReaderComponent, NgClass, CleanDescriptionPipe],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {

  public bookService = inject(BookService);
  public auth = inject(AuthService);
  public router = inject(ActivatedRoute);
  public shelfService = inject(ShelfUserBooksService);
  public notification = inject(NotificationService);
  public fly = inject(FlyToCartService);

  public isLoading = signal<boolean>(true);
  public isNotFound = signal<boolean>(false);
  public book = signal<any>(null);

  public selectedShelf = signal<string>('');

  public readInfo = signal<{ ia?: string; access: string } | null>(null);
  public showReader = signal(false);

  ngOnInit() {
    let user = this.auth.currentUser();

    if (!user) {
      this.notification.show('Please log in to show book details', 'error');
      return;
    }

    this.router.paramMap.subscribe(params => {
      let key = params.get('key') ?? '';
      if (!key) return;
      let workKey = key.startsWith('/') ? key : `/${key}`;
      this.loadBook(workKey);
    });
  }

  loadBook(workBook: string) {
    this.isLoading.set(true);
    this.isNotFound.set(false);
    this.bookService.getWorksDetails(workBook).subscribe({
      next: (data) => {
        this.book.set(data);
        this.isLoading.set(false);
        this.selectedShelf.set(this.shelfService.getStatusBook(this.book().key));
      },
      error: () => { this.isNotFound.set(true); this.isLoading.set(false); }
    });
    this.bookService.getReadInfo(workBook).subscribe((info) => this.readInfo.set(info));
  }

  setStatus(status: ShelfStatus, image: HTMLImageElement, startEle: HTMLButtonElement): void {
    const b = this.book();
    if (!b) return;

    if (!this.shelfService.addOrUpdate(b, status)) return;

    this.selectedShelf.set(status);
    this.notification.show(`The book has been added to shelf as ${status}`);
    this.fly.flyToShelf(image, startEle);
  }

  showModelReader(status: ShelfStatus, image: HTMLImageElement, startEle: HTMLButtonElement) {
    let statusBook = this.shelfService.getStatusBook(this.book().key);
    this.showReader.set(true);
    if (statusBook == 'reading')
      return;
    this.setStatus(status, image, startEle);
  }

  removeFromShelf() {
    this.shelfService.removeBookFromShelf(this.book().key);
    this.selectedShelf.set('');
    this.notification.show(`The book has been removed from shelf`);
  }
}
