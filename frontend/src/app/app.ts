import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { Navbar } from './layout/navbar/navbar';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  // The root element sits inside <body class="flex flex-col">, so it has to
  // pass that column layout through for <main class="flex-1"> to fill.
  host: { class: 'flex min-h-full flex-1 flex-col' },
})
export class App {
  constructor() {
    // Created eagerly so the stored theme is applied before the first render.
    inject(ThemeService);
  }
}
