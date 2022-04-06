import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Order } from "src/app/shared/models/order.model";
import { CartsService } from "src/app/modules/cart/services/carts.service";
import { OrdersService } from "src/app/modules/admin/components/orders/services/orders.service";
import Swal from "sweetalert2";
import { TranslocoService } from "@ngneat/transloco";
@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit, OnDestroy {
  results: Order[] = []; //for send html side
  shipSuccess: boolean; //user information message conditioner

  //subscriptions
  shipSubs: Subscription;
  routeSubs: Subscription;
  orderCame: Subscription;

  constructor(
    private orders: OrdersService,
    private route: ActivatedRoute,
    private carts: CartsService,
    private translate: TranslocoService
  ) {}

  ngOnInit(): void {
    this.getOrdersByResolver(); //first initialize get data from resolver
    // //get data for list and if a product shipped then refresh the page with a subject trigger!

    // get data if a product shipped so i mean removed from table
    this.shipSubs = this.orders.orderShipped.subscribe((idInfos: any) => {
      this.results.forEach((result) => {
        if (
          result.id == idInfos.orderId &&
          result.index == idInfos.orderIndex
        ) {
          this.results.splice(this.results.indexOf(result), 1);
        }
      });
    });
  }
  //unsubscriptions
  ngOnDestroy(): void {
    if (this.shipSubs) {
      this.shipSubs.unsubscribe();
    }
    if (this.routeSubs) {
      this.routeSubs.unsubscribe();
    }
    if (this.orderCame) {
      this.orderCame.unsubscribe();
    }
  }
  getOrdersByResolver(): void {
    //for reach all orders i user object to array conversion and create a new array to send html resolver used here!
    this.routeSubs = this.route.data.subscribe((orders: Order) => {
      orders["orders"].forEach((orderObject: Order) => {
        for (let key in orderObject) {
          if (orderObject[key] != null) {
            orderObject[key].forEach((order: Order) => {
              if (order != null) {
                const newOrder: Order = {
                  description: order.description,
                  imagePath: order.imagePath,
                  price: order.price,
                  productId: order.productId,
                  quantity: order.quantity,
                  stock: order.stock,
                  title: order.title,
                  userEmail: order.userEmail,
                  userId: order.userId,
                  id: key,
                  index: orderObject[key].indexOf(order),
                };
                this.results.push(newOrder);
              }
            });
          }
        }
      });
    });
  }
  //to simulate ship product to owner
  onDelete(userId: string, orderId: string, orderIndex: string): void {
    const thisOrderWillDelete = {
      orderId: orderId,
      orderIndex: orderIndex,
    };
    //sweet alert confirm box! method will wait its promise to call
    Swal.fire({
      title: this.translate.translateObject("sweetAlert.shipSure"),
      text: this.translate.translateObject("sweetAlert.reverse"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.translateObject(
        "sweetAlert.confirmButtonText"
      ),
    }).then((result) => {
      //promise result runs and orders service method calls
      if (result.isConfirmed) {
        this.orders.shipOrder(userId, orderId, orderIndex).subscribe(
          () => {
            this.orders.orderShipped.next(thisOrderWillDelete);
          },
          (error) => {
            this.orders.orderShipped.next(null);
          }
        );
        Swal.fire(
          this.translate.translateObject("sweetAlert.shipped"),
          "",
          "success"
        );
      }
    });
  }
}
