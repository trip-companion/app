import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import IUserModel  from '@app/interfaces/store.models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;
  constructor (private http: HttpClient) {}

  public getCurrentUser() {
    return this.http.get<IUserModel>(`${this.apiUrl}user/current/`, {});
  };

  public getCurrentPageData(pageId: string, language: string) {
    return this.http.get<any>(`${this.apiUrl}public/page/${pageId}/${language}`, {});
  };
};
