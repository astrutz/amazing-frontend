import { Component, inject } from '@angular/core';
import { PageComponent } from '../shared/page/page.component';
import { ThemeService } from '../../services/theme.service';
import { themes } from '../../types/theme.type';

@Component({
  selector: 'app-settings',
  imports: [PageComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly themes = themes;
}
