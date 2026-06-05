import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { take } from 'rxjs/operators';

// Import các component liên quan
import { BorrowDialogComponent } from './dialogs/borrow-dialog/borrow-dialog';
import { ReturnDialogComponent } from './dialogs/return-dialog/return-dialog';
import { BorrowService } from '../../services/borrow.service'; // 👑 ĐỔI SANG DÙNG BORROW SERVICE
import { NotificationService } from '../../services/notification.service'; 

@Component({
  selector: 'app-borrowing',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './borrowing.html',
  styleUrl: './borrowing.css' 
})
export class BorrowingComponent implements OnInit, AfterViewInit { 
  private borrowService = inject(BorrowService); // 👑 Đổi dịch vụ tiêm vào
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private notation = inject(NotificationService); 

  // 👑 ĐÃ SỬA: Thay 'borrowerName' bằng 'availableQuantity' vì bảng sách không chứa trực tiếp tên người mượn
  displayedColumns: string[] = ['title', 'author', 'availableQuantity', 'status', 'actions'];
  books = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit(): void {
    this.loadBooks();
  }

  ngAfterViewInit(): void {
    this.books.paginator = this.paginator;
    this.books.sort = this.sort; 
  }

  loadBooks(): void {
    // 👑 Sử dụng hàm từ BorrowService tập trung
    this.borrowService.getAllBooks().pipe(take(1)).subscribe({
      next: (data) => {
        this.books.data = [...data];
        this.books.paginator = this.paginator; 
        this.books.sort = this.sort; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách sách:', err);
        this.notation.error('❌ Không thể tải danh sách sách mượn trả từ máy chủ!');
      }
    });
  }

  // Hàm xử lý khi bấm nút Mượn
  borrowBook(book: any): void {
    const dialogRef = this.dialog.open(BorrowDialogComponent, {
      width: '800px', 
      maxWidth: '95vw',
      disableClose: true, 
      data: { bookTitle: book.title } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return; 

      const payload = {
        bookId: book.id,
        borrowerName: result.borrowerName,
        phoneNumber: result.phoneNumber, 
        dueDate: result.dueDate,         
        note: result.note || 'Mượn từ Dialog Angular'
      };

      // 👑 ĐÃ SỬA: Gọi thông qua hàm tập trung của BorrowService chứ không viết cứng URL HTTP nữa
      this.borrowService.createBorrowCard(payload).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.notation.success(res.message || '🎉 Lập phiếu mượn sách thành công!');
          this.loadBooks(); // Ép hệ thống lấy lại danh sách sách mới -> Nhảy từ 14 xuống 13 lập tức!
        },
        error: (err) => {
          this.notation.error(err.error?.message || err.error || '❌ Có lỗi xảy ra khi thực hiện mượn sách!');
        }
      });
    });
  }

  // Hàm xử lý khi bấm nút Trả
  returnBook(book: any): void {
    const dialogRef = this.dialog.open(ReturnDialogComponent, {
      width: '800px', 
      maxWidth: '95vw',
      disableClose: true,
      data: { 
        bookId: book.id, 
        bookTitle: book.title 
      }
    });

    dialogRef.afterClosed().subscribe(cardId => {
      if (!cardId) return; 

      // 👑 ĐÃ SỬA: Gọi hàm nghiệp vụ trả qua BorrowService cực kỳ chuyên nghiệp
      this.borrowService.returnBookCard(cardId).pipe(take(1)).subscribe({
        next: (res: any) => {
          this.notation.success(res.message || '↩️ Trả sách và cập nhật số lượng kho thành công!');
          this.loadBooks(); // Ép hệ thống lấy lại danh sách sách mới -> Cộng ngược số lượng lên lại!
        },
        error: (err) => {
          this.notation.error(err.error?.message || '❌ Có lỗi xảy ra khi thực hiện trả sách!');
        }
      });
    });
  }
}