import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { NewComponent } from "src/app/modules/admin/components/new/new.component";

@Injectable({
  providedIn: "root",
})
export class DeactGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: NewComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.canILeave || !component.productLoadForm.dirty) {
      return true;
    }
    return confirm("Are you sure to leave?");
  }
}
