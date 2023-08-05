import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css'],
})
export class ErrorsComponent {
  @Input() errorMessage!: string | null;
}
