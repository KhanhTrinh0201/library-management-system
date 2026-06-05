import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // Thêm RouterModule
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true, // Đảm bảo đã có thuộc tính này
  imports: [
    RouterOutlet, 
    RouterModule,        // Cần thiết cho routerLink
    MatSidenavModule,    // Layout khung
    MatToolbarModule,    // Thanh tiêu đề
    MatListModule,       // Danh sách menu
    MatIconModule        // Icon
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Thư viện Thông minh';
}