import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'editDescription',
})
export class EditDescriptionPipe implements PipeTransform {
  transform(value: string, maxLength: number): string {
    let words = value.split(' ');

    if (words.length <= maxLength)
      return value;

    return words.slice(0, maxLength).join(' ') + '...';
  }
}
