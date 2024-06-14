import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent {
}
