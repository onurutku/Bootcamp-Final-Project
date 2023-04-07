import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegisterResponse } from "../models/register-response.model";
import { FormInput } from "../models/formInputs.model";
import { LoginResponse } from "../models/login-response.model";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { UserLoggedIn } from "../models/userLoggedIn.model";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userLoggedIn = new BehaviorSubject<UserLoggedIn>(null);
  timeForTimer: number = 3600 * 1000;
  errorMessage = new Subject<string>();
  constructor(
    private http: HttpClient,
    private router: Router,
    private angularfireAuth: AngularFireAuth
  ) {}

  //firebase endpoint signUp method returns to register component.ts
  register(newUser: FormInput) {
    //--------------------OLD REGISTER METHOD------------------------------------
    // return this.http.post<RegisterResponse>(
    //   "apikey",
    //   {
    //     email: newUser.email,
    //     password: newUser.password,
    //     returnSecureToken: true,
    //   }
    // );
    //--------------------OLD REGISTER METHOD------------------------------------
    return this.angularfireAuth.createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    );
  }
  //login method it takes form user information
  async login(user: FormInput) {
    try {
      //try login ad send infor to interceptor and save user information to storage
      const result = await this.angularfireAuth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
      const token = await result.user.getIdToken(true); //to get token from API firebase method
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);

      const userLoggedIn: UserLoggedIn = {
        email: result.user.email,
        localId: result.user.uid,
        idToken: token,
        expirationDate: expirationDate,
      };
      if (result.user.emailVerified) {
        this.userLoggedIn.next(userLoggedIn);
        sessionStorage.setItem("user", JSON.stringify(userLoggedIn)); //i'll use this information for auto login method.
        this.autoLogout(this.timeForTimer);
      }
      return result;
    } catch (error) {
      //catch error and send it component.ts file for handle errors
      this.errorMessage.next(error.code);
    }

    //---------------------------------OLD LOGIN METHOD--------------------------------
    //login method it takes form user information
    // return this.http
    //   .post<LoginResponse>( //post method to firebase auth
    //     "apikey",
    //     {
    //       //firebase authentication post methods body
    //       email: user.email,
    //       password: user.password,
    //       returnSecureToken: true,
    //     }
    //   )
    //   .pipe(
    //     // rxJS pipe operator for can use tap function
    //     tap((response: LoginResponse) => {
    //       // tap function that we use for sight-effect to an observiable. Because we used subscribe in a component.ts method
    //       const expirationDate = new Date( //this time calculation for auto logout
    //         new Date().getTime() + +response.expiresIn * 1000
    //       );
    //       //create an object to send behavior subject and localstorage.We'll use this observable in interceptors to create a condition to write data on database
    //       const userLoggedIn: UserLoggedIn = {
    //         email: response.email,
    //         localId: response.localId,
    //         idToken: response.idToken,
    //         expirationDate,
    //       };
    //       //next data with subject and create a user in sessionStorage
    //       this.userLoggedIn.next(userLoggedIn);
    //       sessionStorage.setItem("user", JSON.stringify(userLoggedIn)); //i'll use this information for auto login method.
    //       this.autoLogout(this.timeForTimer);
    //     })
    //   );
    //---------------------------------OLD LOGIN METHOD--------------------------------
  }
  //continue with google
  async loginWithGoogle(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider(); //create a provider
    const credential = await this.angularfireAuth.signInWithPopup(provider); //open a popup for google provider
    const token = await credential.user.getIdToken(true); //to get token from API firebase method
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    const userLoggedIn: UserLoggedIn = {
      //create a object ot save session storage and send to interceptor
      email: credential.user.email,
      localId: credential.user.uid,
      idToken: token,
      expirationDate: expirationDate,
    };

    this.userLoggedIn.next(userLoggedIn);
    sessionStorage.setItem("user", JSON.stringify(userLoggedIn)); //i'll use this information for auto login method.
    this.autoLogout(this.timeForTimer);
  }
  //continue with github;
  async loginWithGithub(): Promise<any> {
    const provider = new firebase.auth.GithubAuthProvider(); //create a github provider
    const credential = await this.angularfireAuth.signInWithPopup(provider); //open a popup for github provider
    const token = await credential.user.getIdToken(true); //to get token from API firebase method
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    const userLoggedIn: UserLoggedIn = {
      //create a object ot save session storage and send to interceptor
      email: credential.user.email,
      localId: credential.user.uid,
      idToken: token,
      expirationDate: expirationDate,
    };

    this.userLoggedIn.next(userLoggedIn);
    sessionStorage.setItem("user", JSON.stringify(userLoggedIn)); //i'll use this information for auto login method.
    this.autoLogout(this.timeForTimer);
  }
  //auto login on page refresh
  autoLogin() {
    const sessionStorageUser = JSON.parse(sessionStorage.getItem("user")); //get data from sessionStorage for new userObject

    if (!sessionStorageUser) {
      //security return
      return;
    }
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000); //set a new expiration time to auto logout

    const newUserFromStorage = {
      //new user Object for  send to interceptor and update session storage
      email: sessionStorageUser.email,
      localId: sessionStorageUser.localId,
      idToken: sessionStorageUser.idToken,
      expirationDate: expirationDate,
    };
    //update session storage for time
    sessionStorage.setItem("user", JSON.stringify(newUserFromStorage));
    this.userLoggedIn.next(newUserFromStorage); //send user again to interceptor
    this.autoLogout(this.timeForTimer); //start new timer
  }

  //logout method
  logout(): void {
    this.userLoggedIn.next(null); //this next null to subject to block data transfer to database because database needs token to transfer data for security
    sessionStorage.removeItem("user"); //also remove user from session storage to block login condition for user on pages.!
    this.router.navigate(["/login"]); //route to login page
  }
  //auto logout timer
  autoLogout(time: number): void {
    setTimeout(() => {
      this.logout();
      this.router.navigate(["/login"]);
    }, time);
  }
  resetPassword(email: string) {
    return this.angularfireAuth.sendPasswordResetEmail(email);
  }
}
