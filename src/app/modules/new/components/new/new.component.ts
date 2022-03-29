import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs";
import { ProductInfo } from "src/app/shared/models/productInfo.model";
import { Products } from "src/app/shared/models/products.model";
import { ProductService } from "src/app/shared/services/product.service";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
export class NewComponent implements OnInit, OnDestroy {
  faCheck = faCheck; //fontawesome variable
  faX = faExclamation; //fontawesome variable

  imageSrc: string | File; //html src variable for image
  selectedImage: any; //angular file reader file

  productLoadForm: FormGroup;

  isDataSavedSuccessfully: boolean; //successmessge for user
  isLoading: boolean = false; //loading spinner variable
  isEditMode: boolean = false;
  productId: string;

  isSavedSubscription: Subscription; //subscriptions

  constructor(
    private product: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //create a new form group and its formcontrols and validations
    this.productLoadForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
      ]),
      price: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      picture: new FormControl(
        null,
        this.isEditMode ? Validators.required : null
      ),
    });
    //get information from service to give information to UI. on HTML
    this.isSavedSubscription = this.product.isSaveComplete.subscribe(
      (isSaved: boolean) => {
        this.isDataSavedSuccessfully = isSaved;
        this.isLoading = null; //stop loading indicator
        if (!this.isEditMode) {
          this.productLoadForm.reset(); //reset the form
          this.router.navigate(["/shop"]); //route the shop
          this.imageSrc = "../../../assets/dummy.jpg"; //a dummy image for empty situtations
        }
      }
    );
    //set new Component to for edit Mode!
    this.route.params.subscribe((productId: Params) => {
      if (productId["id"]) {
        this.isEditMode = true;
        this.productId = productId["id"];
      }
      this.product
        .getDataWithId(productId["id"])
        .subscribe((product: Products) => {
          this.imageSrc = product?.imagePath;
          this.productLoadForm.patchValue({
            title: product?.title,
            price: product?.price,
            description: product?.description,
            stock: product?.stock,
            category: product?.category,
          });
        });
    });
  }
  ngOnDestroy(): void {
    this.isSavedSubscription.unsubscribe();
  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      //if file input has a file

      //Angular filereader library
      const reader: FileReader = new FileReader(); //create an file reader object
      reader.onload = (ev: any) => {
        //call onload method from object
        this.imageSrc = <File>ev.target.result; //give to img src what we read with reader.
      };
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0]; //set a variable to send image to storage
    } else {
      //if user don't choose a photo ofc there is a valdiaiton but extra security
      this.imageSrc = "../../../assets/dummy.jpg";
      this.selectedImage = null;
    }
  }
  //form submit method.
  onSubmit(): void {
    this.isLoading = true;
    //create an object ot send service
    const productInfo: ProductInfo = {
      title: this.productLoadForm.get("title").value,
      price: this.productLoadForm.get("price").value,
      description: this.productLoadForm.get("description").value,
      stock: this.productLoadForm.get("stock").value,
      category: this.productLoadForm.get("category").value,
    };
    //conditions for edit mode or not and also if selected image is null or not!
    if (this.isEditMode && this.selectedImage == null) {
      //if user don't select a image file for upload
      this.product.updateProductData(this.productId, productInfo).subscribe(
        () => {
          this.product.isSaveComplete.next(true);
        },
        (error) => {
          this.product.isSaveComplete.next(false);
        }
      );
    } else {
      //if user select a image on edit or new product add
      this.product
        .upload(
          this.selectedImage,
          productInfo,
          this.isEditMode,
          this.productId
        )
        .subscribe(() => {}); //send storage the selected image and send other values to realtime database
    }
  }
}
