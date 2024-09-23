import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user? :User
  constructor(private http: HttpClient) { }

  getCurrentUser(): User|undefined{

    if(!this.user) return undefined;

    return structuredClone (this.user);
  }

  login (user:string, password:string):Observable<User>{

    //en un caso real se utilizaría un POST
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', user.id.toString()))
    )
  }
}
