import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import IUserModel from '@app/interfaces/store.models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  public getCurrentUser(): Observable<IUserModel> {
    return this.http.get<IUserModel>(`${this.apiUrl}user/current/`, {});
  }

  public getCurrentPageData(pageId: string, language: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}public/page/${pageId}/${language}`, {});
  }

  public putUserAvatar(imgFile: File): Observable<IUserModel> {
    const formData: any = new FormData();
    formData.append('file', imgFile);
    return this.http.post<IUserModel>(`${this.apiUrl}user/avatar`, formData);
  }
}
