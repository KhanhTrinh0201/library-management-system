import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-borrow-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './borrow-dialog.html',
  styleUrl: './borrow-dialog.css'
})
export class BorrowDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<BorrowDialogComponent>);
  readonly data = inject<{ bookTitle: string }>(MAT_DIALOG_DATA);

  borrowForm!: FormGroup;
  minDate: string = ''; // Khóa ngày quá khứ trên giao diện lịch

  ngOnInit(): void {
    // Thiết lập ngày tối thiểu là ngày mai (định dạng YYYY-MM-DD)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    // Tạo form kiểm soát nhập liệu nghiêm ngặt
    this.borrowForm = this.fb.group({
      borrowerName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^(03|05|07|08|09)\d{8}$/) // Định dạng chuẩn SĐT VN
      ]],
      dueDate: ['', [Validators.required]],
      note: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.borrowForm.valid) {
      this.dialogRef.close(this.borrowForm.value);
    }
  }
}