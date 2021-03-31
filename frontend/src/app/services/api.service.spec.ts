import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.services';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationService } from '@app/services/location.service';
import { SharedService } from '@app/services/shared.service';
import { Store } from '@ngrx/store';
import { StoreModule } from '@ngrx/store';

describe('ApiService', () => {
  let apiSrv: ApiService;
  let httpMock: HttpTestingController;
  let authSrv: AuthenticationService;

  const sendRegForm = {
    email: 'test@test.net',
    firstName: 'TestFirstName',
    lastName: 'TestLastName',
    password: 'test555!!!'
  };

  const fakeUser = {
    id: 'id',
    email: 'some string',
    avatarSrc: 'some string',
    firstName: 'some string',
    lastName: 'some string',
    status: 'some string',
    gender: 'some string',
    about: 'some string',
    birthDate: 'some string',
    languages: [
      {
        isoCode: 'some string',
        level: 'some string'
      }
    ],
    knownSkills: ['string1', 'string2'],
    interestedInSkills: ['string1', 'string2'],
    canTeachSkills: ['string1', 'string2'],
    interests: ['string1', 'string2'],
    features: ['string1', 'string2'],
  };

  const pageVar = {
    pageId: 'WELCOME',
    language: 'UKR'
  };

  const userTokens = {
    jwtAccessToken:"accessTokenForTest1111",
    jwtRefreshToken:"refreshTokenForTest1111",
    jwtRefreshTokenExpireDate: 11111,
    tokenType:"Bearer "
  };

  const mapping = {
    mappings:{
      main: {
        searchArea: {
          destination: {
            text: 'Пункт призначення',
            placeholder: 'Виберіть пункт призначення'
          },
          dateRange: {
            text: 'Дати',
            placeholder: 'Виберіть дати відправлення та прибуття'
          },
          peopleCount: {
            text: 'Кількість людей'
          },
          submitButton: {
            text: 'Пошук'
          }
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule.forRoot({})
      ],
      providers: [
        ApiService,
        AuthenticationService,
        LocationService,
        SharedService,
        Store,
      ],
    });

    authSrv = TestBed.get(AuthenticationService);
    apiSrv = TestBed.get(ApiService);
    httpMock = TestBed.get(HttpTestingController);
  });
  

  describe('#check static data page = api.getCurrentPageData', () => {

    it('should return an mapping object', () => {
      apiSrv.getCurrentPageData(pageVar.pageId, pageVar.language).subscribe(response => {
        expect(response).toEqual(mapping);
      }), err => {
        expect(err).toBe('have some error', err);
      };

      const req = httpMock.expectOne(`${apiSrv.apiUrl}public/pages/${'WELCOME'}/${'UKR'}`);
      expect(req.request.method).toBe('GET');
      req.flush(mapping);
    });
  });

  describe('#Register test user', () => {

    it('should return status 201', () => {
      authSrv.singUp(sendRegForm.email,
        sendRegForm.firstName,
        sendRegForm.lastName,
        sendRegForm.password).subscribe(res => {
          expect(res.status).toBe(201);
      });
      
      const req = httpMock.expectOne(`${authSrv.apiUrl}public/users`)
      expect(req.request.body).toEqual({email: sendRegForm.email,
        firstName: sendRegForm.firstName,
        lastName: sendRegForm.lastName,
        password: sendRegForm.password,
      });
      expect(req.request.method).toBe('POST');
      req.flush({status: 201})
    });
  });


  describe('#LogIn test user ', () => {

    it('should return tokens data', () => {
      authSrv.login(sendRegForm.email, sendRegForm.password).subscribe(res => {
        expect(res).toBe(userTokens);
      });
      
      const req = httpMock.expectOne(`${authSrv.apiUrl}public/auth`)
      expect(req.request.body).toEqual({email: sendRegForm. email, password: sendRegForm.password});
      expect(req.request.method).toBe('POST');
      req.flush(userTokens);
    });

    it('#getCurrentUser return user data', () => {
      apiSrv.getCurrentUser().subscribe(user => {
        expect(user).toBe(fakeUser);
      });
  
      const req = httpMock.expectOne(`${authSrv.apiUrl}users/current`)
      expect(req.request.method).toBe('GET');
      req.flush(fakeUser);
    });
  });

  describe('#Edit current user',  () => {

    it('#putUserCurrent return user data', () => {
      const sendUser = JSON.parse(JSON.stringify(fakeUser));
      delete sendUser.id;
      delete sendUser.avatarSrc;
      delete sendUser.email;
      apiSrv.putUserCurrent(sendUser).subscribe(res => {
        expect(res).toBe(fakeUser);
      });
      
      const req = httpMock.expectOne(`${authSrv.apiUrl}users/current`)
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(sendUser);
      req.flush(fakeUser);
    });
  });

});
