import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; // Import module Material

@Component({
  selector: 'app-dashboard',
  standalone: true, // Bắt buộc phải có
  imports: [MatCardModule], // Import vào đây
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent { // Đổi tên class thành DashboardComponent cho chuẩn convention
}