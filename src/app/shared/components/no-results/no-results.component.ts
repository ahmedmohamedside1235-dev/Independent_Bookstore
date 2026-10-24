import { Component, input, output } from '@angular/core';
import { EditTitlePipe } from '../../pipe/edit-title-pipe';

@Component({
  selector: 'app-no-results',
  imports: [EditTitlePipe],
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss',
})
export class NoResultsComponent {
  public query = input.required<string>();
  public suggestions = input<string[]>([]);

  public cleared = output<void>();
  public suggestionPicked = output<string>();
}