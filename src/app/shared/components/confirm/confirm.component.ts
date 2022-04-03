import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-confirm",
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.scss"],
})
export class ConfirmComponent implements OnInit {
  message = "Do you really want to leave from page without save changes?";
  constructor(private product: ProductService) {}

  ngOnInit(): void {}
  modalSubmit() {
    this.product.canILeave.next(true);
  }
  modalCancel() {
    this.product.canILeave.next(false);
  }
}
