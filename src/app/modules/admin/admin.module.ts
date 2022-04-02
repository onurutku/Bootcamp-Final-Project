import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { AdminGuardService } from "src/app/shared/guards/admin-guard.service";
import { AuthGuardService } from "src/app/shared/guards/auth-guard.service";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UsersComponent } from "./components/users/users.component";
import { NewComponent } from "./components/new/new.component";
import { OrdersComponent } from "./components/orders/components/orders/orders.component";
import { OrderResolverService } from "./components/orders/resolvers/order-resolver.service";
import { TranslocoModule } from "@ngneat/transloco";
import { DeactGuard } from "src/app/shared/guards/deact.guard";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ShopComponent } from "../shop/components/shop/shop.component";
import { ShopResolverService } from "../shop/resolvers/shop-resolver.service";
import { DetailComponent } from "../detail/components/detail.component";
import { DetailResolverService } from "../detail/resolvers/detail-resolver.service";

@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    OrdersComponent,
    NewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: DashboardComponent,
        canActivate: [AuthGuardService, AdminGuardService],
        children: [
          {
            path: "users",
            component: UsersComponent,
          },
          {
            path: "new",
            component: NewComponent,
            canDeactivate: [DeactGuard],
          },
          {
            path: "orders",
            component: OrdersComponent,
            resolve: { orders: OrderResolverService },
          },
          {
            path: "edit/:id",
            component: NewComponent,
            canDeactivate: [DeactGuard],
          },
          {
            path: "shop",
            component: ShopComponent,
            resolve: { product: ShopResolverService },
          },
          {
            path: "detail/:id",
            component: DetailComponent,
            resolve: { product: DetailResolverService },
          },
        ],
      },
    ]),
    FormsModule,
    FontAwesomeModule,
    TranslocoModule,
    ReactiveFormsModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [DashboardComponent, UsersComponent, OrdersComponent, NewComponent],
})
export class AdminModule {}
