import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import IUserModel from '@app/interfaces/store.models/user.model';
import { IAcountUserData } from '@app/interfaces/store.models/accountUserData.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}
  //get
  public getCurrentUser(): Observable<IUserModel> {
    return this.http.get<IUserModel>(`${this.apiUrl}users/current/`, {});
  }

  public getCurrentPageData(pageId: string, language: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}public/page/${pageId}/${language}`, {});
  }

  public getAllUserFeatures(): Observable<IAcountUserData['features']> {
    return this.http.get<IAcountUserData['features']>(`${this.apiUrl}public/features`, {});
  }

  public getAllUserLanguages(): Observable<IAcountUserData['languages']> {
    return this.http.get<IAcountUserData['languages']>(`${this.apiUrl}public/languages`, {});
  }

  public getAllUserSkills(): Observable<IAcountUserData['skills']> {
    return this.http.get<IAcountUserData['skills']>(`${this.apiUrl}public/skills`, {});
  }

  public getAllUserInterests(): Observable<IAcountUserData['interests']> {
    return this.http.get<IAcountUserData['interests']>(`${this.apiUrl}public/interests`, {});
  }

  //post
  public postUserAvatar(imgFile: File): Observable<IUserModel> {
    const formData: any = new FormData();
    formData.append('file', imgFile);
    return this.http.post<IUserModel>(`${this.apiUrl}users/current/avatar`, formData);
  }
  //put
  public putUserCurrent(user: IUserModel): Observable<IUserModel> {
    return this.http.put<IUserModel>(`${this.apiUrl}users/current`, {...user});
  }
}
