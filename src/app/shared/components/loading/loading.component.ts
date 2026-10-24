import { Component, input } from '@angular/core';

@Component({
  templateUrl: './loading.component.html',
  imports: [],
  styleUrl: './loading.component.scss',
  selector: 'app-loading',
})
export class loadingComponent {
  public message = input.required<string>();
}
