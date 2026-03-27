import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

const AUTH_API = environment.apiUrl + '/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.userSubject.next(res);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user);
  }

  recoverPassword(data: any): Observable<any> {
    return this.http.post(AUTH_API + 'recover', data);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getToken(): string | null {
    const user = this.userSubject.value;
    return user ? user.token : null;
  }

  getRefreshToken(): string | null {
    const user = this.userSubject.value;
    return user ? user.refreshToken : null;
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post(AUTH_API + 'refreshtoken', {
      refreshToken: token
    }).pipe(
      tap((res: any) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.token = res.accessToken;
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }
}
