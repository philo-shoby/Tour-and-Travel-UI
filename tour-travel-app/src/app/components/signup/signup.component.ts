import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  category: string = '';
  
  constructor(public authService: AuthService,public router: Router,) {}

  onSignUp(email: string,password: string,category = "traveller") {
    try {
      this.authService.SignUp(email,password,category)
      .then(() => {
        window.alert("The account is created. Kindly verify the email and login.")
        this.router.navigate(['sign-in']);
      });
    } catch (error) {
      
    }
  }
}
