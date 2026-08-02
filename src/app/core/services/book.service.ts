import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private BASE_URL: string = 'https://openlibrary.org';
  private http = inject(HttpClient);

  public getBookByCategory(category: string, limit: number = 20) {
    const url: string = `${this.BASE_URL}/search.json?q=${encodeURIComponent(category.toLowerCase())}&limit=${limit}`;
    return this.http.get(url).pipe(
      map((response: any) => (response.docs ?? []).map((doc: any) => this.toBook(doc)))
    );
  }

  private toBook(doc: any) {
    return {
      key: doc.key,
      title: doc.title,
      authorNames: doc.author_name ?? [],
      authorKeys: doc.author_key ?? [],
      firstPublishYear: doc.first_publish_year,
      coverId: doc.cover_i,
      editionCount: doc.edition_count,
      subjects: doc.subject ?? [],
    };
  }
}
