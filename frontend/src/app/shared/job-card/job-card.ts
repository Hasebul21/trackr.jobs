import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job } from '../../core/models';
import { BookmarkButton } from '../bookmark-button/bookmark-button';
import { Icon } from '../icon/icon';
import { MarkAppliedButton } from '../mark-applied-button/mark-applied-button';
import { RelativeTimePipe } from '../relative-time-pipe';
import { sourceLabel } from '../sources';
import { badgeClasses, buttonClasses } from '../ui';

const SUMMARY_LENGTH = 120;
const MAX_TECHS = 3;

@Component({
  selector: 'app-job-card',
  imports: [RouterLink, Icon, BookmarkButton, MarkAppliedButton, RelativeTimePipe],
  templateUrl: './job-card.html',
  host: { class: 'block h-full' },
})
export class JobCard {
  readonly job = input.required<Job>();

  // A short teaser keeps every card about the same height in the grid.
  protected summary = computed(() =>
    this.job().description.slice(0, SUMMARY_LENGTH).replace(/\s+/g, ' '),
  );
  protected truncated = computed(() => this.job().description.length > SUMMARY_LENGTH);
  protected techs = computed(() => this.job().technologies.slice(0, MAX_TECHS));
  protected extraTechs = computed(() => this.job().technologies.length - this.techs().length);
  protected source = computed(() => sourceLabel(this.job().source));
  protected company = computed(() =>
    this.job().company === 'Unknown' ? this.source() : this.job().company,
  );
  protected initials = computed(() => initials(this.company()));
  protected scoreClass = computed(() => {
    const score = this.job().matchedScore;
    if (score >= 100) return 'bg-[var(--gain-50)] text-[var(--gain-700)] border-[var(--gain-200)]';
    if (score >= 50) return 'bg-[var(--warn-50)] text-[var(--warn-700)] border-[var(--warn-200)]';
    return 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]';
  });

  protected badge = badgeClasses;
  protected applyClass = buttonClasses('apply', 'sm');
}

// Two-letter initials for the logo placeholder: first letters of the first
// two words ("Money Lion" -> "ML"), otherwise the first two characters.
function initials(company: string): string {
  const cleaned = company.replace(/\.(com|sg|my|jp|co|io)$/i, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}
