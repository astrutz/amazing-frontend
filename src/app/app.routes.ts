import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';

export const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
