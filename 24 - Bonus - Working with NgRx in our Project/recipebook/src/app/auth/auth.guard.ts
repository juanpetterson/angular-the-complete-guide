import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
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
