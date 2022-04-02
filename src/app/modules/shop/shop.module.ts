import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShopComponent } from "./components/shop/shop.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AuthGuardService } from "../../shared/guards/auth-guard.service";
import { ShopResolverService } from "./resolvers/shop-resolver.service";
import { TranslocoModule } from "@ngneat/transloco";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ShopComponent,
        canActivate: [AuthGuardService], //guard for authentication
        resolve: { product: ShopResolverService }, //this method enter between router and service. and before you route the new page. Service run method and you can get data before you go the page.
      },
    ]),
    SharedModule,
    TranslocoModule,
    FontAwesomeModule,
  ],
  exports: [ShopComponent],
})
export class ShopModule {}
