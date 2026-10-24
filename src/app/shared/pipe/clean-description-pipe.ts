import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cleanDescription' })
export class CleanDescriptionPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    return value
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, '')
      .replace(/(?:https?:\/\/|www\.)\S+/gi, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/^\s*-{3,}\s*$/gm, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}