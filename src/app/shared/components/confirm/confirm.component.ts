import { Component, OnInit } from "@angular/core";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { TranslocoService } from "@ngneat/transloco";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-confirm",
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.scss"],
})
export class ConfirmComponent implements OnInit {
  message = this.translate.translateObject("confirm.confirmComponent");
  faWarning = faExclamation;
  constructor(
    private product: ProductService,
    private translate: TranslocoService
  ) {}

  ngOnInit(): void {}
  modalSubmit() {
    this.product.canILeave.next(true);
  }
  modalCancel() {
    this.product.canILeave.next(false);
  }
}
