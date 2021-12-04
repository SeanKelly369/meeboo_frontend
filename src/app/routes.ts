import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { UserComponent } from './component/user/user.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';

export const appRoutes : Routes = [
    { path : 'home', component : HomeComponent },
    { 
        path : 'register', component : UserComponent,
        children : [ { path: '', component: RegisterComponent}]        
    },
    { 
        path : 'login', component : UserComponent,
        children : [ { path: 'login', component: LoginComponent}]        
    }
];