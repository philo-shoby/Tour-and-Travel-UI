import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/user';
import { CommonService } from 'src/app/shared/services/common.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const URL= 'https://api-u4nj4jf4wq-uc.a.run.app/';

@Component({
  selector: 'app-travellers',
  templateUrl: './travellers.component.html',
  styleUrls: ['./travellers.component.css']
})
export class TravellersComponent implements OnInit{
  catalogues: any;
  catalogClicked: boolean = false;
  bookingsClicked: boolean = false;
  bookingDetails: any;
  userData: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: false,
    category: '',
    catalogId: []
  };
  
  constructor(private http: HttpClient, public authService: AuthService, private commonService: CommonService,
    private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.getCatalogue();
    let userDetails = JSON.parse(localStorage.getItem('user')!);
    this.userData = this.commonService.getUserData(userDetails.uid);
  }

  postBookings(catalogId: string) {
    try {
      if (!this.userData.catalogId.includes(catalogId)) {
        this.userData.catalogId.push(catalogId);
        this.getBookings();
        this.authService.updateUserDb(this.userData);
      }
    } catch (error) {
      console.error(error);
    }
  }
  getBookings() {
    try {
      let temp = [];
      if (this.userData && this.userData.catalogId) {
        for(let selCatId of this.userData.catalogId) {
          for(let catId of this.catalogues) {
            if (selCatId == catId._id) {
              temp.push(catId);
            }
          }
        }
      }
      this.bookingDetails = temp;
    } catch (error) {
      console.error(error);
    }
  }
  deleteBookings(catalogId: string) {
    try {
      this.userData.catalogId = this.userData.catalogId.filter((item: string) => item != catalogId);
      this.getBookings();
      this.authService.updateUserDb(this.userData);
    } catch (error) {
      console.error(error);
    }
  }
  getCatalogue() {
    try {
      let headers;
      if (this.authService.userData) {
        if (this.authService.userData) {
          this.authService.userData.getIdToken()
          .then((idToken: any) => {
            return headers = {Authorization: ` ${idToken}`};
          })
          .then((headers: any) => {
            this.http.get(URL + 'catalogue', { headers: headers }).subscribe((response) => {
              if (response) {
                this.catalogues = response;
              }
            })
          })
        } 
      }        
    } catch (error) {
      console.error(error);
    }
  }
  onSignOut() {
    this.authService.SignOut();
  }
}
