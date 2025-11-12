import { Routes } from '@angular/router';
import { PalleteVisualizer } from './pallete-visualizer/pallete-visualizer';

export const routes: Routes = [
  { path: '', component: PalleteVisualizer },
  { path: '**', redirectTo: '' }
];
