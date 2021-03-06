import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  faShoppingBag,
  faUser,
  faKey,
  faCheck,
  faShieldAlt,
  faCaretSquareLeft,
} from "@fortawesome/free-solid-svg-icons";
import { TranslocoService } from "@ngneat/transloco";
import { FormInput } from "src/app/shared/models/formInputs.model";
import { LoginResponse } from "src/app/shared/models/login-response.model";
import { AuthService } from "src/app/shared/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loggedIn: boolean = false; //for show login message
  isLoading: boolean = false; //for loading spinner effect
  loginErrorMessage: string; //firebase login error messages
  isForgot: boolean = false; //is password forgottten
  resetEmailSentMessage: boolean = false; //a message to user for give information about email send

  //fontAwesome variable
  faUser = faUser;
  faKey = faKey;
  faCheck = faCheck;
  faShoppingBag = faShoppingBag;
  faShield = faShieldAlt;
  faSquareLeft = faCaretSquareLeft;

  constructor(
    private router: Router,
    private auth: AuthService,
    public translate: TranslocoService
  ) {}

  ngOnInit(): void {
    //create reactive form and define validations
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }
  //main login method
  onSubmit(): void {
    //get form values and create a user object to send firebase auth
    this.isLoading = true;
    const user: FormInput = {
      email: this.loginForm.get("email").value,
      password: this.loginForm.get("password").value,
    };
    this.auth.login(user).then((result) => {
      //catch return user value to handle messages on UI side
      if (result.user.emailVerified) {
        this.loggedIn = true; //to show successfull login message
        this.isLoading = false; // loading spinner closed
        this.router.navigate(["/shop"]); //route to dashboard
        this.loginForm.reset();
        this.swalFire();
      } else {
        this.loginErrorMessage = "Please verify your email address first";
        this.isLoading = false; // loading spinner closed
        this.timer2();
      }
    });
    //error handling
    this.auth.errorMessage.subscribe((errorCode: string) => {
      switch (errorCode) {
        case "auth/user-not-found":
          this.loginErrorMessage = "User not Found!";
          break;
        case "auth/wrong-password":
          this.loginErrorMessage = "Wrong Password";
          break;
      }
      this.isLoading = false; // loading spinner closed
      this.timer2();
    });
    //---------------------------------__OLD LOGIN METHOD------------------------------
    // //login method on login service
    // this.auth.login(user).subscribe(
    //   (responseData: LoginResponse) => {
    //     this.loggedIn = true; //to show successfull login message
    //     this.isLoading = false; // loading spinner closed
    //     this.router.navigate(["/shop"]); //route to dashboard
    //     this.loginForm.reset();
    //   },
    //   (error) => {
    //     //these error list conditions has taken from "https://firebase.google.com/docs/reference/rest/auth#section-create-email-password"
    //     switch (error.error.error.message) {
    //       case "EMAIL_NOT_FOUND":
    //         this.loginErrorMessage = "Email not found";
    //         break;
    //       case "INVALID_PASSWORD":
    //         this.loginErrorMessage = "Invalid password";
    //         break;
    //       case "USER_DISABLED":
    //         this.loginErrorMessage = "User banned!";
    //         break;
    //     }
    //     this.isLoading = false;
    //   }
    // );
  }
  //route to the register page button method
  toRegisterPage(): void {
    this.router.navigate(["/register"]);
  }
  //transloco
  changeLang(lang: string): void {
    this.translate.setActiveLang(lang);
  }
  //change UI to forgot password form
  forgot(): void {
    this.isForgot = true;
  }
  //change UI to login form
  toLogin(): void {
    this.isForgot = false;
  }
  //angular fire auth module reset password method
  resetPassword(email: string): void {
    this.auth.resetPassword(email);
    this.resetEmailSentMessage = true;
    this.timer();
  }
  //a timer for giving information to user. send a message to UI
  timer(): void {
    setTimeout(() => {
      this.isForgot = false;
      this.resetEmailSentMessage = false;
    }, 2000);
  }
  timer2(): void {
    setTimeout(() => {
      this.loginErrorMessage = "";
    }, 2000);
  }
  signInGoogle() {
    this.auth.loginWithGoogle().then(() => {
      this.swalFire();
      this.loggedIn = true; //to show successfull login message
      this.router.navigate(["/shop"]); //route to dashboard
    });
  }
  signInGithub() {
    this.swalFire();
    this.auth.loginWithGithub().then(() => {
      this.loggedIn = true; //to show successfull login message
      this.router.navigate(["/shop"]); //route to dashboard
    });
  }
  //sweetalert pop-up
  swalFire() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: this.translate.translateObject("sweetAlert.login"),
      showConfirmButton: false,
      timer: 3000,
    });
  }
}
