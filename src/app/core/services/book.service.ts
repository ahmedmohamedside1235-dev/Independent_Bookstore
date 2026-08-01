import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private BASE_URL: string = 'https://openlibrary.org';
  private http = inject(HttpClient);

  public getBookByCategory(category: string, limit: number = 20) {
    const url: string = `${this.BASE_URL}/search.json?${encodeURIComponent(category.toLowerCase())}&limit=${limit}`;
    return console.log(url);
  }
}
