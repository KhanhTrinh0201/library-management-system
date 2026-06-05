import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 🔥 THÊM: ChangeDetectorRef
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    FormsModule
  ],
  templateUrl: './return-dialog.html',
  styleUrl: './return-dialog.css'
})
export class ReturnDialogComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // 🔥 THÊM: Inject bộ quét dữ liệu

  borrowCards: any[] = [];             
  selectedCardId: number | null = null; 
  isLoading: boolean = true;           

  constructor(
    public dialogRef: MatDialogRef<ReturnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookId: number, bookTitle: string } 
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>(`http://localhost:8080/api/borrow-cards/active-by-book/${this.data.bookId}`)
      .subscribe({
        next: (res) => {
          this.borrowCards = res;
          this.isLoading = false;
          
          if (this.borrowCards.length === 1) {
            this.selectedCardId = this.borrowCards[0].id;
          }
          
          // 🔥 THÊM: Ép Angular cập nhật trạng thái an toàn, xóa sạch lỗi NG0100
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Lỗi khi lấy danh sách người mượn:', err);
          this.isLoading = false;
          
          // 🔥 THÊM: Kể cả khi lỗi cũng ép cập nhật giao diện để hiện hộp thông báo
          this.cdr.detectChanges(); 
        }
      });
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedCardId);
  }
}