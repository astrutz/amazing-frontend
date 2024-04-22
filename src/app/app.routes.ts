import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: 'create',
    component: HomeComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
