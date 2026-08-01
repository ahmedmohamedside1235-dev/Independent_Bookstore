import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly moodes = [
    { icon: '⚔️', name: 'Fantasy' },
    { icon: '🔍', name: 'Mystery' },
    { icon: '💞', name: 'Romance' },
    { icon: '🚀', name: 'Sci-Fi' },
  ];

  public data = inject(BookService);
  // ngOnInit() {
  //   console.log(this.data.getBookByCategory("fiction"));
  // }
}
