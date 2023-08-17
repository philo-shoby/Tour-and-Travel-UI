import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { TravellersComponent } from './components/travellers/travellers.component';
import { PropertyOwnerComponent } from './components/property-owner/property-owner.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: LoginComponent },
  { path: 'create-account', component: SignupComponent },
  { path: 'property-owner', component: PropertyOwnerComponent, canActivate: [AuthGuard]},
  { path: 'traveller', component: TravellersComponent, canActivate: [AuthGuard]},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
