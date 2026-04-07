import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { lucideX } from '@ng-icons/lucide';
import { NgClass } from '@angular/common';

/**
 * Wrapper component for a subpage to contain background, closing icon and title
 */
@Component({
  selector: 'app-page',
  imports: [NgIcon, RouterLink, NgClass],
  templateUrl: './page.component.html',
  viewProviders: [
    provideIcons({
      lucideX,
    }),
  ],
})
export class PageComponent {
  /**
   * H1 to be displayed if wanted
   */
  public title$ = input<string | null>(null);

  /**
   * Subtitle, only gets shown when a title is present
   */
  public subTitle$ = input<string | null>(null);

  /**
   * Subtitle, only gets shown when a title is present
   */
  public width$ = input<'small' | 'large'>('small');
}
