import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

const URL= 'https://api-u4nj4jf4wq-uc.a.run.app/';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  userData: User = {
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    emailVerified: false,
    category: '',
    catalogId: []
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(userId: string) {
    const reqBody = new HttpParams({ fromObject: {uid : userId } });
    let headers;
    if (this.authService.userData) {
      if (this.authService.userData) {
        this.authService.userData.getIdToken()
        .then((idToken: any) => {
          return headers = {Authorization: `${idToken}`};
        })
        .then((headers:any)=>{
          this.http.get(URL + 'users', { headers: headers, params: reqBody }).subscribe((response: any) => {
            console.log(response);
            if (response[0]) {
              this.userData.uid = response[0].uid;
              this.userData.email = response[0].email;
              this.userData.displayName = response[0].displayName;
              this.userData.photoURL = response[0].photoURL;
              this.userData.emailVerified = response[0].emailVerified;
              this.userData.category = response[0].category;
              this.userData.catalogId = this.convertCatalogueData(response[0].catalogId);
            }
          })
        })
      } 
    } 
    return this.userData;
  }
  convertCatalogueData(responseCatalogue: any) {
    let newCatalog = [];
    for(let cat of responseCatalogue) {
      newCatalog.push(cat);
    }
    return newCatalog;
  }
}
