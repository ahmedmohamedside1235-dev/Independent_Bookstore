import { NgStyle, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShelfStatus } from '../../../core/models/shelfStatus.model';
import { EditTitlePipe } from '../../../shared/pipe/edit-title-pipe';

@Component({
  selector: 'app-shelf-status',
  imports: [NgStyle, NgClass, RouterLink, EditTitlePipe],
  templateUrl: './shelf-status.component.html',
  styleUrl: './shelf-status.component.scss',
})
export class ShelfStatusComponent {
  public books = input.required<any[]>();
  public title = input.required<string>();
  public emptyMsg = input.required<string>();
  public color = input.required<string>();
  public statusOptions = input.required<{ value: ShelfStatus; label: string }[]>();


  public changeStatus = output<{ book: any; status: ShelfStatus; img: HTMLImageElement }>();
  public removeBook = output<string>();

  authorsLabel(item: any): string {
    return item.authorName == '' ? 'Unknown author' : item.authorName;
  }

  StatusSelected(book: any, status: ShelfStatus, img: HTMLImageElement) {
    this.changeStatus.emit({ book, status, img });
  }

}
