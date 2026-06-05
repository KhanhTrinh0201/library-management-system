import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { BookFormComponent } from '../../components/book-form/book-form';

// Import các Module giao diện từ thư viện Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 

// Import dịch vụ thông báo dùng chung và Component Dialog xác nhận
import { NotificationService } from '../../services/notification.service'; 
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog'; 

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule 
  ],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class BooksComponent implements OnInit, AfterViewInit {
  // 🗃️ Khởi tạo nguồn dữ liệu cho bảng Angular Material Table
  dataSource = new MatTableDataSource<Book>();
  
  // 📋 Định nghĩa danh sách các cột sẽ hiển thị trên giao diện theo đúng thứ tự
  displayedColumns: string[] = ['id', 'title', 'author', 'category', 'quantity', 'actions'];

  // 💉 Sử dụng tính năng 'inject()' nhúng các dịch vụ vào Component
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);
  private notation = inject(NotificationService); 
  private dialog = inject(MatDialog); // 🌟 Trung tâm điều khiển mở Popup Form

  // 🔍 Truy vấn phần tử từ file HTML để gắn tính năng Sắp xếp (Sort) và Phân trang (Paginator)
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.loadBooks(); 
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * 🔍 BỘ LỌC TÌM KIẾM NHANH
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * 🔄 TẢI DANH SÁCH SÁCH TỪ BACKEND
   */
  loadBooks() {
    this.bookService.getAllBooks().pipe(take(1)).subscribe({
      next: (data) => { 
        this.dataSource.data = [...data];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.dataSource.filterPredicate = (book: Book, filter: string) => {
          const searchStr = filter.toLowerCase();
          return (
            (book.title?.toLowerCase().includes(searchStr) || false) ||
            (book.author?.toLowerCase().includes(searchStr) || false) ||
            (book.category?.toLowerCase().includes(searchStr) || false) ||
            (book.id?.toString().includes(searchStr) || false)
          );
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('ERROR:', err);
        this.notation.error('❌ Không thể tải danh sách sách từ hệ thống!');
      }
    });
  }

  /**
   * ➕ MỞ POPUP THÊM SÁCH MỚI (Thay đổi kiến trúc sang MatDialog)
   */
  openAddForm() {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '550px',
      disableClose: true, // Chặn đóng khi click ra nền đen, tránh mất dữ liệu đang gõ dở
      panelClass: 'custom-modern-dialog',
      data: {
        isEditMode: false,
        book: { id: 0, title: '', author: '', category: '', quantity: 1, availableQuantity: 1 }
      }
    });

    // Hứng dữ liệu trả về sau khi người dùng bấm nút Lưu ở Form con
    dialogRef.afterClosed().pipe(take(1)).subscribe((result: Book | null) => {
      if (result) {
        this.executeSave(result, false);
      }
    });
  }

  /**
   * 📝 MỞ POPUP SỬA SÁCH 
   */
  openEditForm(book: Book) {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '550px',
      disableClose: true,
      data: {
        isEditMode: true,
        book: { ...book } // Clone đối tượng để tránh can thiệp trực tiếp vào dòng của bảng
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: Book | null) => {
      if (result) {
        this.executeSave(result, true);
      }
    });
  }

  /**
   * 💾 XỬ LÝ LƯU GỌI API XUỐNG SERVER (Gộp chung logic từ handleSave cũ)
   */
  private executeSave(bookToSave: Book, isEditMode: boolean) {
    if (isEditMode && bookToSave.id && bookToSave.id > 0) {
      // 🔹 Đường chạy: CẬP NHẬT
      this.bookService.updateBook(bookToSave.id, bookToSave).pipe(take(1)).subscribe({
        next: () => {
          this.notation.success('🎉 Cập nhật thông tin sách thành công!');
          this.loadBooks();
        },
        error: (err) => this.notation.error(err.error?.message || '❌ Lỗi khi chỉnh sửa thông tin sách!')
      });
    } else {
      // 🔹 Đường chạy: THÊM MỚI
      delete (bookToSave as any).id;
      this.bookService.createBook(bookToSave).pipe(take(1)).subscribe({
        next: () => {
          this.notation.success('✨ Thêm đầu sách mới thành công!');
          this.loadBooks();
        },
        error: (err) => this.notation.error(err.error?.message || '❌ Lỗi khi thêm sách mới!')
      });
    }
  }

  /**
   * 🗑️ XÓA ĐẦU SÁCH
   */
  deleteBook(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: '⚠️ Xác nhận xóa đầu sách',
        message: 'Bạn có chắc chắn muốn xóa cuốn sách này khỏi thư viện không? Dữ liệu sẽ bị xóa vĩnh viễn.'
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookService.deleteBook(id).pipe(take(1)).subscribe({
          next: () => {
            this.notation.success('🗑️ Đã xóa đầu sách ra khỏi thư viện!');
            this.loadBooks();
          },
          error: (err) => this.notation.error('❌ Không thể xóa cuốn sách này!')
        });
      }
    });
  }

  /**
   * 📖 THAO TÁC MƯỢN SÁCH TẠI CHỖ
   */
  borrowBook(book: Book) {
    const originalBook = { ...book };
    book.availableQuantity--;
    book.status = 'Borrowed';
    this.dataSource.data = [...this.dataSource.data]; 

    this.bookService.updateBookStatus(book.id, book).pipe(take(1)).subscribe({
      next: () => {
        this.notation.success(`📖 Đã mượn cuốn sách "${book.title}" thành công!`);
      },
      error: () => {
        Object.assign(book, originalBook);
        this.dataSource.data = [...this.dataSource.data];
        this.notation.error('❌ Thao tác mượn sách thất bại!');
      }
    });
  }

  /**
   * ↩️ THAO TÁC TRẢ SÁCH TẠI CHỖ
   */
  returnBook(book: Book) {
    book.availableQuantity++;
    book.status = 'Available';

    this.bookService.updateBookStatus(book.id, book).pipe(take(1)).subscribe({
      next: () => {
        this.notation.success(`↩️ Đã trả cuốn sách "${book.title}" về kho!`);
        this.loadBooks();
      },
      error: () => {
        this.notation.error('❌ Thao tác trả sách thất bại!');
      }
    });
  }
}