import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ColorModeService {
    theme = signal<'light' | 'dark'>(this.loadTheme());
    constructor() {
        effect(() => {
            document.documentElement.setAttribute('data-theme', this.theme());
            localStorage.setItem('bookStore.theme', this.theme());
        });
    }

    toggle(): void {
        this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    }

    private loadTheme(): 'light' | 'dark' {
        return (localStorage.getItem('bookStore.theme') as 'light' | 'dark') ?? 'dark';
    }
}
