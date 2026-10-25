import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { EditDescriptionPipe } from '../../pipe/edit-description-pipe';
import { EditTitlePipe } from '../../pipe/edit-title-pipe';
import { BookService } from '../../../core/services/bookServices/book.service';
import { FlyToCartService } from '../../../core/services/bookServices/fly-to-cart.service';
import { ShelfUserBooksService } from '../../../core/services/bookServices/shelf-user-books.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  imports: [EditDescriptionPipe, EditTitlePipe],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {

  private router = inject(Router);
  private bookService = inject(BookService);
  private flyToCartService = inject(FlyToCartService);
  private shelfUserBooksService = inject(ShelfUserBooksService);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);

  public book = input.required<any>();
  public bookDescription = signal<string | ''>('');
  public isDescriptionRequest = signal<boolean>(false);
  public descriptionLoad = signal<boolean>(true);
  public isBookInShelf = signal<boolean>(false);

  public img = viewChild<ElementRef<HTMLImageElement>>('bookImg');
  public btnAddShelf = viewChild<ElementRef<HTMLButtonElement>>('btnAddShelf');

  ngOnInit() {
    this.shelfUserBooksService.isBookInShelf(this.book().key) ? this.isBookInShelf.set(true) : this.isBookInShelf.set(false);
  }

  // get book description if it is not already fetched
  public getDescriptionBooks() {

    if (this.isDescriptionRequest()) {
      return;
    }

    this.bookService.getWorksDetails(this.book().key).subscribe((book: any) => {
      this.bookDescription.set(book.description ?? 'No description available for this book yet.');
      this.descriptionLoad.set(false);
      this.isDescriptionRequest.set(true);
    });

  }

  public addToShelf() {
    let isLogin = this.authService.currentUser() !== null;

    if (!isLogin) {
      this.notification.show('Please log in to add books to your shelf.', 'error');
      this.router.navigate(['/auth']);
      return;
    }

    let imgElement = this.img()?.nativeElement,
      btnElement = this.btnAddShelf()?.nativeElement;

    let isAdded = this.shelfUserBooksService.addOrUpdate(this.book());
    if (isAdded) {
      this.notification.show('Book added to your shelf!', 'success');
      this.isBookInShelf.set(true);

      if (imgElement && btnElement) {
        this.flyToCartService.flyToShelf(imgElement, btnElement);
      }

      return;
    }

    this.notification.show('Failed to add book to your shelf try again later.', 'error');
    this.isBookInShelf.set(false);

  }

  public removeFromShelf() {
    this.shelfUserBooksService.removeBookFromShelf(this.book().key);
    this.notification.show('Book removed from your shelf!', 'success');
    this.isBookInShelf.set(false);
  }

  showDetailsBook(key: any) {
    this.router.navigate(['/book_details', key]);
  }
}
