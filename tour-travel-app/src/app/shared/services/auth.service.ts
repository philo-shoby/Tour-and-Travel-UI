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
    //const sessionDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    const sessionDuration = 1 * 60 * 1000;
    const sessionExpiry = Date.now() + sessionDuration;

    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
        };
        this.userDetails = userData; 
        localStorage.setItem('sessionTimeout', JSON.stringify(sessionExpiry));
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, category: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result : any) => {
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          category: category          
        };
        this.sendVerificationMail();
        this.createUserAccount(userData);
        return result.user;
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }


  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user || this.isSessionExpired()) {
      this.SignOut();
      return false;
    }
    return true;
  }

  
  // Sign out
  SignOut() {
    window.alert("Session Timeout, please log in again!");
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('sessionTimeout');
      this.router.navigate(['sign-in']);
    });
  }

  // Update the user details in mongodb
  updateUserDb(user: any) {
    try {
      let headers;
      if (this.userData && this.isLoggedIn) {
        this.userData.getIdToken()
        .then((idToken: any) => {
          return headers = {Authorization: ` ${idToken}`};
        })
        .then((headers: any) => {
          this.http.put(URL + 'users', user, { headers: headers}).subscribe((response) => {
            console.log(response);
          })
        })        
      }   
    } catch (error) {
      console.error(error);
    }
  }

  createUserAccount(user: any) {
    try {
      this.http.post(URL + 'users', user).subscribe((response) => {
        console.log(response);
      })   
    } catch (error) {
      console.error(error);
    }
  }

  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .catch((err) => {
        window.alert(err);
      });
  }

  isSessionExpired(): boolean {
    const storedData = JSON.parse(localStorage.getItem('sessionTimeout')!);
    if (storedData) {
      return Date.now() > storedData;
    }
    return true; // If sessionExpiry is not present or user data is not present, consider session expired
  }
}