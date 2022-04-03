import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable } from "rxjs";
import { NewComponent } from "src/app/modules/admin/components/new/new.component";
import { ProductService } from "../services/product.service";

@Injectable({
  providedIn: "root",
})
export class DeactGuard implements CanDeactivate<unknown> {
  constructor(private product: ProductService) {}
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
    component.showPopUp = true;
    if (component.canILeave || !component.productLoadForm.dirty) {
      return true;
    }
    //this subject wait as AnonymousSubject and when i click yes or cancel button it becomes
    //a observable and return my value. If use subscribe method instead of pipe(map). method return SafeSubscription
    //and i can't handle type Subscription in here. :S
    return this.product.canILeave.pipe(
      map((data) => {
        component.showPopUp = false;
        return data;
      })
    );
  }
}
