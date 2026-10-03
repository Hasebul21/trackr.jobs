import { Component, input } from '@angular/core';

export type IconName =
  | 'arrow-left'
  | 'bookmark'
  | 'briefcase'
  | 'building'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'coins'
  | 'external-link'
  | 'globe'
  | 'inbox'
  | 'laptop'
  | 'map-pin'
  | 'menu'
  | 'moon'
  | 'plane'
  | 'refresh'
  | 'search'
  | 'settings'
  | 'sliders'
  | 'sun'
  | 'user'
  | 'x'
  | 'x-circle';

// Inline versions of the lucide icons the original UI used. The host uses
// display: contents so the <svg> sits in the parent's layout directly and
// selectors like [&_svg]:size-4 on buttons still apply.
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  host: { style: 'display: contents' },
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly iconClass = input('');
}
