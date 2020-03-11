import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }

        return this.router.createUrlTree(['/auth']);
      })
    );
  }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   router: RouterStateSnapshot
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   return this.authService.user.pipe(
  //     map(user => {
  //       return !!user;
  //     }),
  //     tap(isAuth => {
  //       if (!isAuth) {
  //         this.router.navigate(['/auth']);
  //       }
  //     })
  //   );
  // }
}
