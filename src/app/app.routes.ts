import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
