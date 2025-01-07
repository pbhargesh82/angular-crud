import {Component, inject, PLATFORM_ID} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {PrimeNG, ThemeConfigType} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {DarkModeService} from '@services/dark-mode.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'angular-crud';
  primeng: PrimeNG = inject(PrimeNG);
  themeConfig: ThemeConfigType = {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark'
      }
    }
  }
  darkModeService: DarkModeService = inject(DarkModeService);
  platformId: object = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.primeng.setThemeConfig(this.themeConfig);
    if (isPlatformBrowser(this.platformId)) {
      const darkMode = !!localStorage.getItem('darkMode');
      this.darkModeService.updateDarkMode(darkMode);
    }
  }

  toggleDarkMode(): void {
    this.darkModeService.updateDarkMode(!this.darkModeService.getDarkMode);
  }
}
