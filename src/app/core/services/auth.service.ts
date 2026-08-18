import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens, LoginDto } from '../models/auth.model';
import { decodeAccessToken, isExpired } from './jwt.util';

const ACCESS_TOKEN_KEY = 'sp_access_token';
const REFRESH_TOKEN_KEY = 'sp_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  private readonly refreshTokenValue = signal<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));

  readonly currentUser = computed(() => {
    const token = this.accessToken();
    return token ? decodeAccessToken(token) : null;
  });

  readonly isAuthenticated = computed(() => !isExpired(this.currentUser()));
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  /** Shared in-flight refresh call so concurrent 401s trigger a single POST /auth/refresh. */
  private refreshInFlight$: Observable<AuthTokens> | null = null;

  constructor(private readonly http: HttpClient) {}

  getAccessToken(): string | null {
    return this.accessToken();
  }

  login(dto: LoginDto): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/login`, dto).pipe(tap((tokens) => this.setTokens(tokens)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.clearTokens()),
      catchError(() => {
        this.clearTokens();
        return throwError(() => new Error('logout-failed'));
      }),
    );
  }

  refresh(): Observable<AuthTokens> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }
    const refreshToken = this.refreshTokenValue();
    if (!refreshToken) {
      return throwError(() => new Error('no-refresh-token'));
    }
    this.refreshInFlight$ = this.http.post<AuthTokens>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((tokens) => this.setTokens(tokens)),
      catchError((err) => {
        this.clearTokens();
        return throwError(() => err);
      }),
      shareReplay(1),
      tap({ complete: () => (this.refreshInFlight$ = null), error: () => (this.refreshInFlight$ = null) }),
    );
    return this.refreshInFlight$;
  }

  private setTokens(tokens: AuthTokens): void {
    this.accessToken.set(tokens.accessToken);
    this.refreshTokenValue.set(tokens.refreshToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private clearTokens(): void {
    this.accessToken.set(null);
    this.refreshTokenValue.set(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
