import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
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
          // we need to return an observable, but map always returns an observable
          map(responseData => {
            const {
              email,
              localId: userId,
              idToken: token,
              expiresIn
            } = responseData;

            const expirationDate = new Date(
              new Date().getTime() + +expiresIn * 1000
            );
            return new AuthActions.Login({
              email,
              userId,
              token,
              expirationDate
            });
          }),
          // we need to return an observable
          catchError(errorResponse => {
            // ...
            let errorMessage = 'An unknow eror occurred!';

            if (!errorResponse.error || !errorResponse.error.error) {
              return of(new AuthActions.LoginFail(errorMessage));
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
            return of(new AuthActions.LoginFail('Incorrect email or password'));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
