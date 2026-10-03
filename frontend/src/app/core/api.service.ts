import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facets, Job, JobFilters, JobPage, JobStats, RefreshResult, Settings } from './models';

// All calls go to /api. In dev, proxy.conf.json forwards that to the Nest
// server; in production the hosting rewrites it to the API deployment.
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  getJobs(filters: JobFilters): Observable<JobPage> {
    let params = new HttpParams();
    if (filters.q) params = params.set('q', filters.q);
    for (const s of filters.source ?? []) params = params.append('source', s);
    for (const c of filters.country ?? []) params = params.append('country', c);
    for (const l of filters.level ?? []) params = params.append('level', l);
    if (filters.visa) params = params.set('visa', '1');
    if (filters.remote) params = params.set('remote', '1');
    if (filters.days) params = params.set('days', filters.days);
    if (filters.sort) params = params.set('sort', filters.sort);
    if (filters.page) params = params.set('page', filters.page);
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize);

    return this.http.get<JobPage>(`${this.baseUrl}/jobs`, { params });
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${encodeURIComponent(id)}`);
  }

  getJobsByIds(ids: string[]): Observable<{ jobs: Job[] }> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<{ jobs: Job[] }>(`${this.baseUrl}/jobs/lookup`, {
      params,
    });
  }

  getFacets(): Observable<Facets> {
    return this.http.get<Facets>(`${this.baseUrl}/jobs/facets`);
  }

  getStats(): Observable<JobStats> {
    return this.http.get<JobStats>(`${this.baseUrl}/jobs/stats`);
  }

  markApplied(id: string): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      `${this.baseUrl}/jobs/${encodeURIComponent(id)}/applied`,
      {},
    );
  }

  refresh(): Observable<RefreshResult> {
    return this.http.post<RefreshResult>(`${this.baseUrl}/refresh`, {});
  }

  getSettings(): Observable<Settings> {
    return this.http.get<Settings>(`${this.baseUrl}/settings`);
  }
}
