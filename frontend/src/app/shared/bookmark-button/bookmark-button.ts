import { Component, computed, inject, input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BookmarksService } from '../../core/bookmarks.service';
import { buttonClasses } from '../ui';

@Component({
  selector: 'app-bookmark-button',
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './bookmark-button.html',
})
export class BookmarkButton {
  readonly id = input.required<string>();
  readonly iconOnly = input(false);

  private bookmarks = inject(BookmarksService);

  protected active = computed(() => this.bookmarks.has(this.id()));
  protected buttonClass = computed(() =>
    buttonClasses(this.active() ? 'secondary' : 'ghost', this.iconOnly() ? 'icon' : 'sm'),
  );

  toggle(event: Event) {
    // The button can sit inside a link, so don't let the click navigate.
    event.preventDefault();
    event.stopPropagation();
    this.bookmarks.toggle(this.id());
  }
}
