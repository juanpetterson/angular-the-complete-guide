import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknow eror occurred!';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      errorMessage = 'Incorrect email or password';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      const { email, password } = signupAction.payload;

      return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
          {
            email,
            password,
            returnSecureToken: true
          }
        )
        .pipe(
          tap(responseData => {
            this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
          }),
          // we need to return an observable, but map always returns an observable
          map(responseData => {
            const {
              email,
              localId: userId,
              idToken: token,
              expiresIn
            } = responseData;

            return handleAuthentication(email, userId, token, +expiresIn);
          }),
          // we need to return an observable
          catchError(errorResponse => {
            // ...
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const { email, password } = authData.payload;

      return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
          {
            email,
            password,
            returnSecureToken: true
          }
        )
        .pipe(
          tap(responseData => {
            this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
          }),
          // we need to return an observable, but map always returns an observable
          map(responseData => {
            const {
              email,
              localId: userId,
              idToken: token,
              expiresIn
            } = responseData;

            return handleAuthentication(email, userId, token, +expiresIn);
          }),
          // we need to return an observable
          catchError(errorResponse => {
            // ...
            return handleError(errorResponse);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);

        const { email, id: userId, token } = loadedUser;

        return new AuthActions.AuthenticateSuccess({
          email,
          userId,
          token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
        });
        // this.user.next(loadedUser);

        // this.autoLogout(expirationDuration);
      }

      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
