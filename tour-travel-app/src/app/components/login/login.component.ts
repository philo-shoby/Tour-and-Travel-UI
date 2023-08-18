import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

const URL= 'https://api-u4nj4jf4wq-uc.a.run.app/';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(public authService: AuthService, private router: Router, public http: HttpClient) {}
  
  userData: any;

  onLogin(email: string, password: string) {
    
    this.authService.login(email, password)
    .then(() => {
      const queryParams = new HttpParams({ fromObject: {uid : this.authService.userDetails.uid} });
      let headers;
      if (this.authService.userData) {
        if (this.authService.userData) {
          this.authService.userData.getIdToken()
          .then((idToken: any) => {
            return headers = {Authorization: `${idToken}`};
          })
          .then((headers:any) => {
            this.http.get(URL + 'users', { headers: headers ,params: queryParams }).subscribe((response: any) => {
              let category = response[0].category;
              switch (category) {
                case 'traveller':
                  this.router.navigate(['traveller']);
                  break;
                case 'propertyOwner':
                  this.router.navigate(['property-owner']);
                  break;
                case 'admin':
                  this.router.navigate(['admin']);
                  break;
              
                default:
                  this.router.navigate(['sign-in'])
                  break;
              }
            })
          })
          .catch((err:any) => {
            console.error(err);
          })
        } 
      } 
    })
    
  }
}
