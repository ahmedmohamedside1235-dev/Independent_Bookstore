import { NgStyle, NgClass } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShelfStatus } from '../../../core/models/shelfStatus.model';
import { EditTitlePipe } from '../../../shared/pipe/edit-title-pipe';

@Component({
  selector: 'app-shelf-status',
  imports: [NgStyle, NgClass, RouterLink, EditTitlePipe],
  templateUrl: './shelf-status.component.html',
  styleUrl: './shelf-status.component.scss',
})
export class ShelfStatusComponent implements OnInit {

  public books = input.required<any[]>();
  public title = input.required<string>();
  public emptyMsg = input.required<string>();
  public color = input.required<string>();
  public statusOptions = input.required<{ value: ShelfStatus; label: string }[]>();

  public selectOption: ShelfStatus | undefined;

  public changeStatus = output<{ bookKey: string; status: ShelfStatus }>();
  public removeBook = output<string>();

  ngOnInit(): void {
    this.selectOption = this.books()[0]?.status;
  }

  authorsLabel(item: any): string {
    return item.authorName == '' ? 'Unknown author' : item.authorName;
  }

  StatusSelected(bookKey: string, status: ShelfStatus) {
    this.selectOption = status;
    this.changeStatus.emit({ bookKey, status });
  }

}
