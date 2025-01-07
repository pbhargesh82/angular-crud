import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  darkModeSignal = signal<boolean>(false);

  updateDarkMode(value: boolean): void {
    this.darkModeSignal.set(value);
    if (this.darkModeSignal()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  public get getDarkMode(): boolean {
    return this.darkModeSignal();
  }

}
