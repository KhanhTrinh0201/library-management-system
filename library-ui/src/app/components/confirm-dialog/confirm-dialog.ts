import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialogComponent {
  // Inject các dịch vụ quản lý Dialog của Material
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);

  // Người dùng chọn Hủy
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  // Người dùng chọn Đồng ý
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}