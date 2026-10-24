import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'editTitle',
})
export class EditTitlePipe implements PipeTransform {
  transform(value: string, type = 'title', action = 'cut'): string {
    if (!value) return '';

    if (type === 'title') {
      let words = value.split(' ');
      return words.length <= 3 ? value : words.slice(0, 3).join(' ') + '...';
    }

    if (type === 'userName' && action === 'getShort') {
      return value.trim().charAt(0).toUpperCase();
    }

    return value.length <= 12 ? value : value.split('').slice(0, 12).join('') + '...';
  }
}
