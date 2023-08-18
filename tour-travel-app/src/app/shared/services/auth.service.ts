import { Injectable } from '@angular/core';
import { User } from '../services/user';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore,} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

const URL= 'https://api-u4nj4jf4wq-uc.a.run.app/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  userDetails: any;
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public http: HttpClient
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          category: result.user.category
        };
        this.userDetails = userData;
        
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, category: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result : any) => {
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,          
        };
        this.updateUserDb(userData);
        return result.user;
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }


  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  // Update the user details in mongodb
  updateUserDb(user: User) {
    try {
      let headers;
      if (this.userData) {
        if (this.userData) {
          this.userData.getIdToken()
          .then((idToken: any) => {
            return headers = {Authorization: ` ${idToken}`};
          })
          .then((headers: any) => {
            this.http.post(URL + 'users', user, { headers: headers}).subscribe((response) => {
              console.log(response);
            })
          })
        } 
      }   
    } catch (error) {
      console.error(error);
    }
  }
}