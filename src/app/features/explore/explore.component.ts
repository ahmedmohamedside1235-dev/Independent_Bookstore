import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { BookService } from '../../core/services/bookServices/book.service';
import { loadingComponent } from "../../shared/components/loading/loading.component";
import { BookCardComponent } from "../../shared/components/book-card/book-card.component";
import { AnimationDirective } from "../../shared/directives/animation.directive";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NoResultsComponent } from '../../shared/components/no-results/no-results.component';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, BookCardComponent, AnimationDirective, NoResultsComponent, loadingComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent implements OnInit, OnDestroy {

  // category
  public readonly categories = [
    { id: 1, name: "fantasy", spineHeights: [35, 42, 26], subject: 'fantasy', bookCount: "210 books" },
    { id: 2, name: "Mystery", spineHeights: [36, 24, 30], subject: 'mystery', bookCount: "175 books" },
    { id: 3, name: "Romance", spineHeights: [30, 40, 22], subject: 'romance', bookCount: "196 books" },
    { id: 4, name: "History", spineHeights: [40, 26, 32], subject: 'history', bookCount: "122 books" },
    { id: 5, name: "Sci-Fi", spineHeights: [37, 42, 22], subject: 'science_fiction', bookCount: "240 books" },
    { id: 6, name: "Poetry", spineHeights: [28, 38, 18], subject: 'poetry', bookCount: "88 books" },
  ];

  public readonly popularSearches = ['Harry Potter', 'Agatha Christie', 'Sci-Fi classics'];
  public readonly suggestionNames = this.categories.map((category) => category.name);

  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private router = inject(ActivatedRoute);
  private routerLinks = inject(Router);
  private notificationService = inject(NotificationService);

  // signal subjects and search value from input
  public activeSubject = signal<string | null>(null);
  public searchQuery = signal<string | null>(null);

  // signal array of books
  public books = signal<any[]>([]);

  // signal get books
  public isLoadBooks = signal<boolean>(false);
  public isErrorLoad = signal<boolean>(false);
  public isLoadingMore = signal<boolean>(false);

  // is there more books to load? (hide "Load More" when false)
  public hasMore = signal<boolean>(true);

  // signal load more books
  private pageNumber = signal<number>(1);
  private readonly pageSize = 15;
  private numberBooks = this.pageSize;

  // the current running request (so we can cancel it when a new one starts)
  private request?: Subscription;

  public search: string = "";
  public oldValueSearch: string = "";

  // the body of books
  public bodyBooks = viewChild<ElementRef>("body");

  // if found query params in url
  ngOnInit() {
    // check if user is login or not
    this.checkIsLogin();

    this.router.params.subscribe(params => {
      let query = params['query'] ?? '';
      this.getBooks(query);
    });
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  private checkIsLogin() {
    if (!this.authService.currentUser()) {
      this.notificationService.show('Please log in to explore books.', 'error');
      this.routerLinks.navigate(['/auth']);
      return;
    }
  }

  private scrollToBooks() {
    window.scrollTo({
      top: this.bodyBooks()?.nativeElement.offsetTop
    });
  }

  // handel get books by query from home page if exists
  public getBooks(query: string) {
    let matchedCategory = this.categories.find((category) => category.name.toLowerCase() === query.toLowerCase());

    if (matchedCategory) {
      this.getBooksBySubject(matchedCategory.subject);
    } else if (query) {
      this.getBooksByQuery(query.toLowerCase().trim());
    }

    this.scrollToBooks();
  }

  // set active to subject and get books
  public setActiveSubject(subject: string): void {
    if (this.activeSubject() === subject) return;
    this.getBooksBySubject(subject);
  }

  // if error found and user click reload books again
  public reloadBooks() {
    if (this.searchQuery()) {
      this.getBooksByQuery(this.searchQuery()!);
    } else {
      this.getBooksBySubject(this.activeSubject() ?? 'fantasy');
    }
  }

  // reset signal before get books
  private resetSignal(value: string, isQuery: boolean = false) {

    // cancel any request still running (first load OR load more)
    this.request?.unsubscribe();

    this.isLoadBooks.set(true);
    this.isErrorLoad.set(false);
    this.isLoadingMore.set(false);
    this.hasMore.set(true);

    this.searchQuery.set(isQuery ? value : null);
    this.activeSubject.set(!isQuery ? value : null);

    this.pageNumber.set(1);
    this.numberBooks = this.pageSize;
    this.books.set([]);
  }

  // shared handler for the first page of results
  private loadFirstPage(request$: Observable<any[]>) {
    this.request = request$.subscribe({
      next: (books) => {
        this.books.set(books);
        this.hasMore.set(books.length >= this.pageSize);
        setTimeout(() => this.isLoadBooks.set(false), 200);
      },
      error: () => {
        this.isErrorLoad.set(true);
        this.isLoadBooks.set(false);
      }
    });
  }

  // get books by subject
  public getBooksBySubject(subject: string | null) {
    if (!subject) return;

    this.resetSignal(subject);
    this.scrollToBooks();
    this.loadFirstPage(this.bookService.getBooksBySubject(subject, this.pageSize));
  }

  // get books by query search and is not a subject
  public getBooksByQuery(query: string) {
    if (query.length < 3) {
      this.notificationService.show('The search value must be at least 3 letters', 'error');
      return;
    }

    this.resetSignal(query, true);
    this.scrollToBooks();
    this.loadFirstPage(this.bookService.getBookByCategory(query, this.pageSize));
  }

  // load the next 15 books
  public loadMore() {
    if (this.isLoadingMore() || !this.hasMore()) return;

    this.pageNumber.update((val) => val + 1);
    this.numberBooks = this.pageNumber() * this.pageSize;
    this.isLoadingMore.set(true);

    let query = this.searchQuery(),
      subject = this.activeSubject();

    let request$ = query
      ? this.bookService.getBookByCategory(query, this.numberBooks)
      : this.bookService.getBooksBySubject(subject ?? 'fantasy', this.numberBooks);

    this.request?.unsubscribe();
    this.request = request$.subscribe({
      next: (books: any[]) => {
        this.books.set(books);

        // if the server returned less than we asked for, there is nothing more
        this.hasMore.set(books.length >= this.numberBooks);

        setTimeout(() => this.isLoadingMore.set(false), 200);
      },
      error: () => {
        // keep the books already shown, just go back one page and tell the user
        this.pageNumber.update((val) => val - 1);
        this.numberBooks = this.pageNumber() * this.pageSize;
        this.isLoadingMore.set(false);
        this.notificationService.show('Failed to load more books, try again.', 'error');
      }
    });
  }

  // show books form query form search in section explore
  public showBooks() {
    const value = this.search.toLowerCase().trim();

    if (!value) {
      this.clearSearch();
      this.scrollToBooks();
      return;
    }

    if (this.oldValueSearch === value && !this.isErrorLoad()) return;

    this.oldValueSearch = value;
    this.search = value;
    this.getBooks(value);
  }

  public clearSearch() {
    this.request?.unsubscribe();
    this.search = '';
    this.oldValueSearch = '';
    this.searchQuery.set(null);
    this.activeSubject.set(null);
    this.isErrorLoad.set(false);
    this.isLoadBooks.set(false);
    this.isLoadingMore.set(false);
    this.books.set([]);
    this.routerLinks.navigate(['/explore']);
  }

}