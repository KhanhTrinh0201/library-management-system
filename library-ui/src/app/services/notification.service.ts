import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  // Thông báo thành công (Nền xanh chữ trắng)
  success(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 3000,               // Tự động tắt sau 3 giây
      horizontalPosition: 'right',   // Hiển thị bên phải
      verticalPosition: 'top',       // Ở phía trên cùng màn hình
      panelClass: ['success-snackbar'] // Class CSS để lát nữa custom màu xanh
    });
  }

  // Thông báo thất bại / lỗi (Nền đỏ chữ trắng)
  error(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 4000,               // Lỗi thì cho hiển thị lâu hơn chút (4 giây)
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']   // Class CSS để lát nữa custom màu đỏ
    });
  }
}