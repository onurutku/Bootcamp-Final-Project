import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  faCaretSquareLeft,
  faKey,
  faShieldAlt,
  faShoppingBag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { TranslocoService } from "@ngneat/transloco";
import { FormInput } from "src/app/shared/models/formInputs.model";
import { RegisterResponse } from "src/app/shared/models/register-response.model";
import { AuthService } from "src/app/shared/services/auth.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  passwordWarning: boolean; //password doesnt match error. custom validation
  registerError: string; //registerError messages from firebase
  isLoading: boolean = false; //for loading spinner effect
  verifyMailSent: boolean = false;

  //variables for fontawesome npm
  faShoppingBag = faShoppingBag;
  faUser = faUser;
  faKey = faKey;
  faShield = faShieldAlt;
  faSquareLeft = faCaretSquareLeft;

  //double check for password custom validation
  checkPasswords: ValidatorFn = (
    registerForm: AbstractControl
  ): ValidationErrors | null => {
    let pass = registerForm.get("password").value;
    let confirmPass = registerForm.get("repassword").value;
    if (pass != confirmPass) {
      this.passwordWarning = true;
    } else {
      this.passwordWarning = false;
    }
    return pass === confirmPass ? null : { notSame: true };
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private translate: TranslocoService
  ) {}

  ngOnInit(): void {
    //create register form and define validations
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern("((?=.*[a-z])(?=.*[A-Z]).{6,30})"),
        ]),
        repassword: new FormControl(null, Validators.required),
      },
      { validators: this.checkPasswords }
    );
  }
  onSubmit(): void {
    this.isLoading = true;
    //get form values and send to service for registration
    const newUser: FormInput = {
      email: this.registerForm.get("email").value,
      password: this.registerForm.get("password").value,
      returnSecureToken: true, //response token from firebase API signup method
    };
    //send data to auth service and call register method.
    this.auth.register(newUser).then(
      (response) => {
        response.user.sendEmailVerification().then(() => {
          this.isLoading = false; //close spinner icon
          // this.toLoginPage(); //route the login page if login success
          this.registerForm.reset(); //reset the form inputs
          this.verifyMailSent = true;
        });
        this.swalFire();
      },
      //error messages from firebase API
      (error) => {
        switch (error.error.error.message) {
          case "EMAIL_EXISTS":
            this.registerError = "This email address already exist";
            break;
          case "OPERATION_NOT_ALLOWED":
            this.registerError = "Not-Allowed Try Again";
            break;
          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            this.registerError = "Too many attempts,please try again later";
            break;
        }
        this.isLoading = false; //close the spinner
      }
    );

    //--------------------------------OLD REGISTER METHOD---------------------------------
    // //send data to auth service and call register method.
    // this.auth.register(newUser).subscribe(
    //   (responseData: RegisterResponse) => {
    //     this.isLoading = false; //close spinner icon
    //     this.toLoginPage(); //route the login page if login success
    //     this.registerForm.reset(); //reset the form inputs
    //   },
    //   //catch post method errors and put them to a variable to show on html
    //   (error) => {
    //     //these error list conditions has taken from "https://firebase.google.com/docs/reference/rest/auth#section-create-email-password"
    //     switch (error.error.error.message) {
    //       case "EMAIL_EXISTS":
    //         this.registerError = "This email address already exist";
    //         break;
    //       case "OPERATION_NOT_ALLOWED":
    //         this.registerError = "Not-Allowed Try Again";
    //         break;
    //       case "TOO_MANY_ATTEMPTS_TRY_LATER":
    //         this.registerError = "Too many attempts,please try again later";
    //         break;
    //     }
    //     this.isLoading = false; //close the spinner
    //   }
    // );
    //--------------------------------OLD REGISTER METHOD---------------------------------
  }
  toLoginPage(): void {
    this.router.navigate(["/login"]);
  }
  changeLang(lang: string): void {
    this.translate.setActiveLang(lang);
  }
  signInGoogle() {
    this.auth.loginWithGoogle().then(() => {
      this.swalFire();
      this.router.navigate(["/shop"]); //route to dashboard
    });
  }
  signInGithub() {
    this.auth.loginWithGithub().then(() => {
      this.swalFire();
      this.router.navigate(["/shop"]); //route to dashboard
    });
  }
  swalFire() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: this.translate.translateObject("sweetAlert.register"),
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
