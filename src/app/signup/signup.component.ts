import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NgForm } from '@angular/forms';
import { StorageService } from '../_services/storage.service';

import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signedUp = false;
  user :  SocialUser = new SocialUser;
  errorMessage = "";

  password1: any;
  password2: any;

  constructor (
    private authService: AuthService,
    private storageService: StorageService,
    private socialAuthService: SocialAuthService
    ){}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.authService.socialSignup(
            this.user.firstName,
            this.user.lastName,
            this.user.email
            ).subscribe(
              {
                next: data => {
                  console.log(data);
                  this.storageService.saveUser(data.token);
                  this.signedUp = true
                },
                error: err => {
                  this.errorMessage = err.error.message;
                  console.log(this.errorMessage);
                }
              }
            )
      this.signedUp = (user != null);
    });
  }

  onSubmit(form : NgForm){
    const {firstName, lastName, email, password, agreement, verifyBy} = form.value
    const phoneNumber = form.value.countryCode + form.value.phoneNumber;

    this.authService.signup(firstName, lastName,phoneNumber , email, password, agreement, verifyBy).subscribe({
      next: data => {
        console.log(data);
        this.storageService.saveUser(data.token);
        this.signedUp = true
      },
      error: err => {
        this.errorMessage = err.error.message;
        console.log(this.errorMessage);
      }
    });
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
}
