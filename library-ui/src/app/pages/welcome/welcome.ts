import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // 1. Import module

@Component({
  selector: 'app-welcome',
  standalone: true, // Đảm bảo đã có thuộc tính này
  imports: [MatIconModule], // 2. Thêm vào mảng imports
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'],
})
export class Welcome {}