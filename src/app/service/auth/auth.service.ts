import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '../jwtHelper/jwt-helper.service';
import * as moment from 'moment';

const AUTH_USER = 'auth-user';
const AUTH_API = 'https://www.meeboo.org:9000/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type' : 'application/json'})
};


@Injectable({ providedIn: 'root' })
export class AuthService {

  private token: string = '';
  private jwtHelper = new JwtHelperService;

  private subject = new BehaviorSubject<User>(null);
  user$ : Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  message: Observable<string>

  constructor(private http: HttpClient, public router: Router, private store: Store<User> ) {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
    const user = sessionStorage.getItem(AUTH_USER);

    if(user) {
      this.subject.next(JSON.parse(user));
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${AUTH_API}signin`, {
      username,
      password
    }, httpOptions);
  }

  register(firstName: string, lastName: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${AUTH_API}signup`, {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    }, httpOptions);
  }

  logout() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-user');
  }

  canActivate(): boolean {
    this.message = this.store.dispatch({type: 'message'}) as any;
    if (this.message) {
      return false;
    }
    return true;
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    if(this.token !== null && this.token !== '') {
      if(this.jwtHelper.decodeToken(this.token).sub !== null || '') {
        if(!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }
    return moment().isBefore(this.getExpiration());
  }

  loadToken(): void {
    this.token = sessionStorage.getItem('auth-token');
  }

  getToken(): string {
    return this.token;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    let expiration = '';
    expiration = sessionStorage.getItem('auth-user');
    for(let [key, value] of Object.entries(expiration)) {
      if(key === 'expirationDat;e') {
        return value;
      }
    }
    return null;
  }


}
