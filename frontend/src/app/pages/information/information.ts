import { Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ACADEMIC,
  AWARDS,
  CERTIFICATIONS,
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  PUBLICATIONS,
  REFERENCES,
  RESEARCHGATE,
  SECTIONS,
  SKILLS,
  STATEMENT_PLACEHOLDERS,
  TEST_SCORES,
} from './information.data';

const BADGE =
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors';

@Component({
  imports: [NgTemplateOutlet, RouterLink],
  selector: 'app-information',
  templateUrl: './information.html',
})
export class Information {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly profile = PROFILE;
  protected readonly sections = SECTIONS;
  protected readonly contact = CONTACT;
  protected readonly academic = ACADEMIC;
  protected readonly education = EDUCATION;
  protected readonly experience = EXPERIENCE;
  protected readonly skills = SKILLS;
  protected readonly researchGate = RESEARCHGATE;
  protected readonly publications = PUBLICATIONS;
  protected readonly projects = PROJECTS;
  protected readonly certifications = CERTIFICATIONS;
  protected readonly awards = AWARDS;
  protected readonly testScores = TEST_SCORES;
  protected readonly references = REFERENCES;
  protected readonly statements = STATEMENT_PLACEHOLDERS;

  protected readonly extLink =
    'text-[var(--foreground)] underline underline-offset-2 hover:opacity-80';
  protected readonly badgeOutline = `${BADGE} border-[var(--border)] text-[var(--foreground)]`;
  protected readonly badgeVerify = `${BADGE} border-amber-500/50 text-amber-700 dark:text-amber-300`;
  protected readonly badgeMissing = `${BADGE} border-[var(--border)] text-[var(--muted-foreground)]`;

  // The URL hash is the source of truth, so /information#contact deep
  // links and back/forward both pick the right section.
  private readonly fragment = toSignal(this.route.fragment);

  protected readonly activeSection = computed(() => {
    const id = this.fragment();
    return id && SECTIONS.some((s) => s.id === id) ? id : SECTIONS[0].id;
  });

  protected readonly activeIndex = computed(() =>
    SECTIONS.findIndex((s) => s.id === this.activeSection()),
  );

  protected select(id: string): void {
    // replaceUrl keeps section switches from piling up history entries.
    this.router.navigate([], { relativeTo: this.route, fragment: id, replaceUrl: true });
    this.scrollToTop();
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected number(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  protected stripProtocol(url: string): string {
    return url.replace(/^https?:\/\//, '');
  }

  protected telHref(phone: string): string {
    return `tel:${phone.replace(/\s+/g, '')}`;
  }

  protected isMe(author: string): boolean {
    return author.startsWith('Hasebul Hassan Chowdhury');
  }
}
