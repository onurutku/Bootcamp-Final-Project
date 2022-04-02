import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Data, Params, Router } from "@angular/router";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import {
  faCartPlus,
  faEdit,
  faPenAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs";
import { Products } from "src/app/shared/models/products.model";
import { UserLoggedIn } from "src/app/shared/models/userLoggedIn.model";
import { AuthService } from "src/app/shared/services/auth.service";
import { ProductService } from "src/app/shared/services/product.service";

@Component({
  selector: "app-shop",
  templateUrl: "./shop.component.html",
  styleUrls: ["./shop.component.scss"],
})
export class ShopComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("all", { static: false }) all: ElementRef; //"all" category button ,i'm using it for css
  //fontawesome variable
  faCartPlus = faCartPlus;
  faTrash = faTrashAlt;
  faEdit = faEdit;

  //others
  products: Products[] = [];
  categoryToggle: boolean;
  categoryValue: string;
  categories: string[] = [
    "sweatshirt",
    "pants",
    "shirts",
    "jumper",
    "coats",
    "jacket",
    "shorts",
  ];
  buttonValue: string;
  //subscription
  categorySubs: Subscription;
  productSubs: Subscription;
  searcSubs: Subscription;
  queryParamsSubs: Subscription;
  //pagination
  totalPage: number;
  currentPage: number = 0;
  willSort: Products[] = [];
  query: string; //queryparameter from page;
  layer: Products[] = []; //layer product holder for pagination
  userLoggedIn: UserLoggedIn; //user logged in

  listOrCard: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private product: ProductService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    //to get user logged in from auth service
    this.auth.userLoggedIn.subscribe((userLoggedIn: UserLoggedIn) => {
      this.userLoggedIn = userLoggedIn;
    });
    //get queryparam value to make a filter on page
    this.queryParamsSubs = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.query = queryParams.search;
        this.buttonValue = this.query;
        if (queryParams.search == undefined) {
          console.log("udefined grid" + queryParams.search);

          this.showAll();
        } else {
          console.log("else gidi" + queryParams.search);
          // this.initShopDataSearch(queryParams.search);
          this.getAllData();
        }
        //set button css
        this.setCss();
      }
    );
    //resolver observable subscribe here
    this.productSubs = this.route.data.subscribe((products: Data) => {
      this.willSort = products["product"]; //all data from database

      //total page calculations and first 8 item on page
      this.totalPage = Math.floor(products["product"].length / 8);
      for (let i = this.currentPage * 8; i < 8 * (this.currentPage + 1); i++) {
        if (i < products["product"].length) {
          this.products.push(products["product"][i]);
        } else {
          return;
        }
      }
    });
    //category filter subscribe
    this.searcSubs = this.product.search.subscribe((search) => {
      this.categoryValue = search;
    });
    this.product.categoryToggle.subscribe((status) => {
      this.categoryToggle = status;
    });
    this.product.isDeleted.subscribe((isDeleted: boolean) => {
      this.getAllData();
    });
  }
  getAllData() {
    this.product.getAllData().subscribe((products: Products[]) => {
      this.willSort = products;
      this.initShopDataSearch(this.query);
    });
  }
  ngAfterViewInit(): void {
    //after view load. set the first button (all) css
    this.setCss();
  }
  //reload array with querParams value;
  initShopDataSearch(searchValue: string) {
    this.products = [];
    this.currentPage = 0;
    this.layer = [];
    this.willSort.forEach((product: Products) => {
      if (product.category === searchValue) {
        this.layer.push(product);
      }
    });
    this.totalPage = Math.floor(this.layer.length / 8);
    for (let i = this.currentPage * 8; i < 8 * (this.currentPage + 1); i++) {
      //recall next 8 item
      if (i < this.layer.length) {
        this.products.push(this.layer[i]);
      } else {
        return;
      }
    }
  }
  //after page up or down load items on page
  initShopData(): void {
    this.products = [];
    for (let i = this.currentPage * 8; i < 8 * (this.currentPage + 1); i++) {
      //recall next 8 item
      if (i < this.layer.length) {
        this.products.push(this.layer[i]);
      } else {
        return;
      }
    }
  }
  //when user clicked showAll button recalculate items
  showAll() {
    this.products = [];
    this.totalPage = Math.floor(this.willSort.length / 8);
    for (let i = this.currentPage * 8; i < 8 * (this.currentPage + 1); i++) {
      //recall next 8 item
      if (i < this.willSort.length) {
        this.products.push(this.willSort[i]);
      } else {
        return;
      }
    }
  }
  //unsubscribe subscriptions if exist
  ngOnDestroy(): void {
    if (this.productSubs) {
      this.productSubs.unsubscribe();
    }
    if (this.searcSubs) {
      this.searcSubs.unsubscribe();
    }
    if (this.queryParamsSubs) {
      this.queryParamsSubs.unsubscribe();
    }
    if (this.categorySubs) {
      this.categorySubs.unsubscribe();
    }
  }
  //page up method
  pageUp(): void {
    if (this.currentPage != this.totalPage) {
      //guard for max page
      this.currentPage++; //increase current page
      if (!this.query) {
        //if there is no filter value
        this.showAll();
      } else {
        this.initShopData(); //call reload method
      }
    }
  }
  //page down button method
  pageDown(): void {
    if (this.currentPage != 0) {
      //guard for min page "0"
      this.currentPage--; //decrease current page
      if (!this.query) {
        //if there is no filter value
        this.showAll();
      } else {
        this.initShopData(); //call reload method
      }
    }
  }
  //this will set some css to "all" category button when the url=/shop it means start page.!
  setCss(): void {
    if (this.router.url == "/shop") {
      this.all?.nativeElement.classList.add("focus");
      this.all?.nativeElement.classList.remove("all");
      this.buttonValue = "";
    } else {
      this.all?.nativeElement.classList.add("all");
      this.all?.nativeElement.classList.remove("focus");
    }
  }
  //sort by prices! hight to low or to high
  sortBy(what: string) {
    if (what == "HL") {
      this.willSort.sort((a, b) => {
        if (a.price > b.price) return -1;
        if (a.price < b.price) return 1;
        return 0;
      });
    } else {
      this.willSort.sort((a, b) => {
        if (a.price > b.price) return 1;
        if (a.price < b.price) return -1;
        return 0;
      });
    }
    if (!this.query) {
      this.showAll();
    } else {
      this.initShopDataSearch(this.query);
    }
  }
  //get button value for make button css on hover dynamic
  sendVal(value: string): void {
    this.buttonValue = value;
  }
  listCardToggle(): void {
    this.listOrCard = !this.listOrCard;
  }
  //delete production method
  onDelete(productId: string): void {
    // this.isLoading = true;
    this.product.deleteProduct(productId).subscribe(
      (response: null) => {
        // this.isLoading = false;
        this.product.isDeleted.next(true);
      },
      //error handling for delete method
      (error) => {
        // this.isDeleted = false;
      }
    );
  }
}
