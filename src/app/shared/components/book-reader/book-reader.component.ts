import { Component, DestroyRef, HostListener, computed, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrl: './book-reader.component.scss',
})
export class BookReaderComponent {
  private sanitizer = inject(DomSanitizer);

  public ia = input.required<string>();
  public title = input<string>('');
  public closed = output<void>();

  public url = computed(() => {
    const ia = this.ia();
    if (!/^[\w.\-]+$/.test(ia)) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://archive.org/embed/${ia}`);
  });

  constructor() {
    document.body.style.overflow = 'hidden';
    inject(DestroyRef).onDestroy(() => (document.body.style.overflow = ''));
  }

  @HostListener('document:keydown.escape')
  close() {
    this.closed.emit();
  }
}