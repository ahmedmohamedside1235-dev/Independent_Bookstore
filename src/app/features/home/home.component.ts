import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/bookServices/book.service';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { AnimationDirective } from '../../shared/directives/animation.directive';
import { Router } from '@angular/router';
import { loadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, AnimationDirective, BookCardComponent, loadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public books = signal<any[]>([]);
  private router = inject(Router);
  public bookDescriptions = signal<any[]>([]);
  public isLoading = signal<boolean>(true);
  public isError = signal<boolean>(false);
  private bookService = inject(BookService);
  public search: string = "";

  readonly moodes = [
    { icon: 'fa-hat-wizard', name: 'Fantasy' },
    { icon: 'fa-user-secret', name: 'Mystery' },
    { icon: 'fa-heart', name: 'Romance' },
    { icon: 'fa-rocket', name: 'Sci-Fi' },
  ];

  readonly hows = [
    { icon: 'fa-magnifying-glass', text: 'Live results from millions of titles on Open Library.', name: 'Search' },
    { icon: 'fa-bookmark', text: 'One click, three simple statuses to track.', name: 'Save to shelf' },
    { icon: 'fa-chart-line', text: 'Watch your shelf and stats grow over time.', name: 'Track progress' },
  ];

  ngOnInit() {
    this.loadBooks();
  }

  public loadBooks() {
    this.bookService.getBookByCategory('fiction', 15).subscribe({
      next: (books) => {
        this.books.set(books);
        setTimeout(() => {
          this.isLoading.set(false);
        }, 100);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  public reloadBooks() {
    this.isLoading.set(true);
    this.isError.set(false);
    this.loadBooks();
  }

  public sendQuerySearchToExplore() {
    if (!this.search) return;
    this.showBooksInExplore(this.search);
  }


  public showBooksInExplore(query: string) {
    if (!query) return;
    this.router.navigate(['explore', query.toLowerCase().trim()]);
  }
}
