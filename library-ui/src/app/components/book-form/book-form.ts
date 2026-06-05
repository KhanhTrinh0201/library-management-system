import { Component, OnInit, Inject, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Book } from '../../models/book';

// 🌟 IMPORT THÊM CÁC THÀNH PHẦN QUẢN LÝ DIALOG
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatDialogModule // 🌟 Thêm module phục vụ kiến trúc popup mới
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookFormComponent implements OnInit { 
  // Biến hứng cấu hình, không dùng decorator @Input() nữa
  book!: Book;
  isEditMode: boolean = false;

  private fb = inject(FormBuilder);
  bookForm!: FormGroup; 

  // 💉 Inject các công cụ xử lý Dialog của Angular Material
  private dialogRef = inject(MatDialogRef<BookFormComponent>);
  private dialogData = inject(MAT_DIALOG_DATA); // Token nhận data từ BooksComponent truyền sang

  ngOnInit(): void {
    // 📥 Trích xuất dữ liệu đầu vào được đóng gói trong token DATA
    this.book = this.dialogData.book;
    this.isEditMode = this.dialogData.isEditMode;

    // Khởi tạo và nạp dữ liệu trực tiếp vào form
    this.initForm();
  }

  private initForm(): void {
    const initialQuantity = this.isEditMode ? this.book?.quantity : 1;
    const initialAvailable = this.isEditMode ? this.book?.availableQuantity : 1;

    this.bookForm = this.fb.group({
      id: [this.isEditMode ? this.book?.id : null],
      title: [this.book?.title || '', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(150)
      ]],
      author: [this.book?.author || '', [Validators.required]],
      category: [this.book?.category || '', [Validators.required]],
      quantity: [initialQuantity, [
        Validators.required, 
        Validators.min(1), 
        Validators.max(1000)
      ]],
      availableQuantity: [initialAvailable, [Validators.required, Validators.min(0)]],
      status: [this.book?.status || 'Available']
    });

    // Tự động đồng bộ số lượng khả dụng khi thay đổi số lượng tổng (Chỉ áp dụng luồng Thêm Mới)
    this.bookForm.get('quantity')?.valueChanges.subscribe(val => {
      if (!this.isEditMode && val && val >= 1 && val <= 1000) {
        this.bookForm.get('availableQuantity')?.setValue(val, { emitEvent: false });
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;

      if (!this.isEditMode) {
        formValue.availableQuantity = formValue.quantity;
        formValue.status = 'Available';
      } else {
        formValue.availableQuantity = this.book.availableQuantity;
        formValue.status = this.book.status;
      }

      // 🌟 Đóng popup và trả gói dữ liệu sạch về cho hàm .afterClosed() ở BooksComponent xử lý tiếp
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    // 🌟 Đóng popup và truyền về giá trị null (biểu thị hành động hủy bỏ thao tác)
    this.dialogRef.close(null);
  }
}