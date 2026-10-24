import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private BASE_URL: string = 'https://openlibrary.org';
  private http = inject(HttpClient);

  public getBookByCategory(category: string, limit: number = 20): Observable<any> {
    const url: string = `${this.BASE_URL}/search.json?q=${encodeURIComponent(category.toLowerCase())}&limit=${limit}`;
    return this.http.get(url).pipe(
      map((response: any) => (response.docs ?? []).map((doc: any) => this.toBook(doc)))
    );
  }

  public getWorksDetails(workKey: string): Observable<any> {
    const url = `${this.BASE_URL}${workKey}.json`;
    return this.http.get<any>(url).pipe(
      map((work) => ({
        ...this.toBook(work),
        description: this.extractDescription(work.description),
        subjects: work.subjects ?? [],
      }))
    );
  }

  private extractDescription(desc?: string | { value: string }): string | undefined {
    if (!desc) return undefined;
    return typeof desc === 'string' ? desc : desc.value;
  }

  public getBooksBySubject(subject: string, limit: number = 20): Observable<any> {
    const url = `${this.BASE_URL}/subjects/${encodeURIComponent(subject.toLowerCase())}.json?limit=${limit}`;
    return this.http.get<{ works: any[] }>(url).pipe(
      map((response) =>
        (response.works ?? []).map((book) => this.toBook(book))
      )
    );
  }

  private toBook(doc: any) {
    const coverId = doc.cover_i ?? doc.cover_id ?? doc.covers?.[0] ?? null;
    const authorName = doc.author_name?.[0] ?? doc.authors?.[0]?.name ?? "";

    return {
      key: doc.key,
      title: doc.title,
      authorName: authorName ?? [],
      authorKeys: doc.author_key ?? [],
      firstPublishYear: doc.first_publish_year,
      coverId: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : undefined,
      editionCount: doc.edition_count
    };
  }

  // book.service.ts
  public getReadInfo(workKey: string): Observable<{ ia?: string; access: string }> {
    const url = `${this.BASE_URL}/search.json?q=${encodeURIComponent('key:' + workKey)}&fields=key,ia,ebook_access,has_fulltext&limit=1`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const doc = res.docs?.[0];
        return {
          ia: doc?.ia?.[0],
          access: doc?.ebook_access ?? 'no_ebook'
        };
      })
    );
  }
}
