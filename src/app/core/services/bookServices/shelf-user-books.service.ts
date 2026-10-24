import { computed, effect, inject, Service, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { ShelfStatus } from '../../models/shelfStatus.model';

type ShelfStore = Record<string, any[]>;

@Service()
export class ShelfUserBooksService {

    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);

    //each books for user
    private store = signal<ShelfStore>(this.loadFromStorage());


    // update the shelfBooks signal whenever the store changes
    private shelfBooks = computed(() => {
        let userId = this.authService.currentUser()?.id;
        return userId ? (this.store()[userId] ?? []) : [];
    });

    public total = computed(() => this.shelfBooks().length);

    // status of books
    public wantToRead = computed(() => this.shelfBooks().filter((book) => book.status === 'want-to-read'));
    public reading = computed(() => this.shelfBooks().filter((book) => book.status === 'reading'));
    public finished = computed(() => this.shelfBooks().filter((book) => book.status === 'finished'));

    // save the store to localStorage whenever it changes
    constructor() {
        effect(() => {
            localStorage.setItem('shelfBooks', JSON.stringify(this.store()));
        });
    }

    public getStatusBook(bookKey: string) {
        return this.shelfBooks().find((book) => book.key === bookKey)?.status ?? '';
    }

    // add a book to the shelf for the current user
    public addOrUpdate(book: any, status: ShelfStatus = 'want-to-read'): boolean {
        let userId = this.authService.currentUser()?.id,
            now = Date.now(),
            existing = this.shelfBooks().find((bookShelf) => bookShelf.key === book.key);

        if (!userId) {
            this.notificationService.show('Please log in to add books to your shelf.', 'error');
            return false;
        }

        if (existing) {
            this.store.update((store) => ({
                ...store,
                [userId]: (store[userId] ?? []).map((item) =>
                    item.key === book.key ? { ...item, status, updatedAt: now } : item
                )
            }));

            return true;

        } else {
            let { key, title, authorName, firstPublishYear, coverId } = book,
                newBook = {
                    key, title, authorName, firstPublishYear, coverId,
                    addedAt: now, updatedAt: now, status
                };

            this.store.update((store) => ({
                ...store,
                [userId]: [newBook, ...(store[userId] ?? [])]
            }));
            return true;

        }
    }

    updateStatus(bookKey: string, status: ShelfStatus): void {
        let userId = this.authService.currentUser()?.id;

        if (!userId) return;

        this.store.update((store) => ({
            ...store,
            [userId]: (store[userId] ?? []).map((book) =>
                book.key === bookKey ? { ...book, status, updatedAt: Date.now() } : book
            )
        }));
    }

    public removeBookFromShelf(bookKey: string): void {
        let userId = this.authService.currentUser()?.id;

        if (!userId) return;

        this.store.update(store => ({
            ...store,
            [userId]: (store[userId] ?? []).filter(book => book.key !== bookKey)
        }));
    }

    private loadFromStorage(): ShelfStore {
        let data = localStorage.getItem('shelfBooks');
        return data ? JSON.parse(data) : {};
    }

    public isBookInShelf(bookKey: string): boolean {
        let userId = this.authService.currentUser()?.id;
        if (!userId) return false;
        return (this.store()[userId] ?? []).some(book => book.key === bookKey);
    }
}