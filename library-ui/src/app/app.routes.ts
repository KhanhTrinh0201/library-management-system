import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { BooksComponent } from './pages/books/books';
import { BorrowingComponent } from './pages/borrowing/borrowing';
import { ReportsComponent } from './pages/reports/reports';
import { ReadersComponent } from './pages/readers/readers';


export const routes: Routes = [
  { path: '', component: Welcome }, // Mặc định hiển thị trang Chào mừng
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', component: BooksComponent }, 
  { path: 'borrowing', component: BorrowingComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'readers', component: ReadersComponent },
  
];