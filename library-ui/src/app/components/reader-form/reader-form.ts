import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Reader } from '../../models/reader';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// 🌟 IMPORT THÊM CÁC THÀNH PHẦN QUẢN LÝ DIALOG
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-reader-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatDialogModule // 🌟 Đưa Module Dialog vào imports
  ],
  templateUrl: './reader-form.html',
  styleUrl: './reader-form.css',
})
export class ReaderFormComponent implements OnInit {
  // Biến hứng cấu hình nội bộ
  reader!: Reader;
  isEditMode: boolean = false;
  
  private fb = inject(FormBuilder);
  readerForm!: FormGroup; 

  // 💉 Inject bộ đôi quản lý Dialog
  private dialogRef = inject(MatDialogRef<ReaderFormComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    // 📥 Lấy dữ liệu an toàn từ Component cha thông qua Dialog Token
    this.reader = this.dialogData.reader;
    this.isEditMode = this.dialogData.isEditMode;

    // Khởi tạo cấu trúc Form gốc
    this.initForm();
    
    // Đồng bộ giá trị độc giả nếu có (Chế độ sửa)
    if (this.isEditMode && this.reader) {
      this.readerForm.patchValue(this.reader);
    }
    
    // Khóa/Mở và cập nhật trạng thái Validator cho ô nhập mã độc giả
    this.updateReaderCodeState();
  }

  /**
   * Khởi tạo cấu trúc FormGroup với các luật Validation
   */
  private initForm(): void {
    this.readerForm = this.fb.group({
      id: [this.isEditMode ? this.reader?.id : null],
      
      readerCode: [this.reader?.readerCode || '', [
        Validators.minLength(3),
        Validators.maxLength(10)
      ]],
      
      fullName: [this.reader?.fullName || '', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲÝỴÝỶỸửữựỳýỵỷỹ\s]+$/)
      ]],
      
      phoneNumber: [this.reader?.phoneNumber || '', [
        Validators.required,
        Validators.pattern(/^(03|05|07|08|09)\d{8}$/) 
      ]],
      
      email: [this.reader?.email || '', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/i) 
      ]]
    });
  }

  /**
   * 🌟 ĐIỀU CHỈNH ĐỘNG: Khóa ô nhập mã độc giả và cấu hình Validator
   */
  private updateReaderCodeState(): void {
    const readerCodeControl = this.readerForm.get('readerCode');
    if (!readerCodeControl) return;

    if (this.isEditMode) {
      // 🔹 CHẾ ĐỘ SỬA: Khóa cứng ô nhập, bắt buộc phải có dữ liệu cũ
      readerCodeControl.disable({ emitEvent: false });
      readerCodeControl.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
    } else {
      // 🔹 CHẾ ĐỘ THÊM MỚI: Khóa ô nhập (vì hệ thống tự sinh mã), gỡ bỏ Validator Required
      readerCodeControl.disable({ emitEvent: false });
      readerCodeControl.setValidators([Validators.minLength(3), Validators.maxLength(10)]);
    }
    
    readerCodeControl.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    if (this.readerForm.valid) {
      // 👑 Sử dụng getRawValue() để lấy trọn vẹn giá trị bao gồm cả ô bị disable (readerCode)
      // Sau đó đóng popup và gửi dữ liệu về cho hàm afterClosed ở component cha xử lý
      this.dialogRef.close(this.readerForm.getRawValue()); 
    }
  }

  onCancel(): void {
    // Đóng popup và trả về null (Hủy thao tác)
    this.dialogRef.close(null);
  }
}