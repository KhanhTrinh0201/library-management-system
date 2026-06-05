import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators'; 
import { Subject } from 'rxjs'; 
import { Reader } from '../../models/reader';
import { ReaderService } from '../../services/reader.service';
import { ReaderFormComponent } from '../../components/reader-form/reader-form'; 
import { NotificationService } from '../../services/notification.service'; 
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog'; 

@Component({
  selector: 'app-readers',
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
  templateUrl: './readers.html',
  styleUrl: './readers.css'
})
export class ReadersComponent implements OnInit, AfterViewInit, OnDestroy { 
  private destroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<Reader>([]);
  displayedColumns: string[] = ['id', 'readerCode', 'fullName', 'phoneNumber', 'email', 'actions'];

  private readerService = inject(ReaderService);
  private cdr = inject(ChangeDetectorRef);
  private notation = inject(NotificationService); 
  private dialog = inject(MatDialog); 

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadReaders();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReaders(): void {
    this.readerService.getAllReaders().pipe(take(1), takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.dataSource.data = [...data];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        
        this.dataSource.filterPredicate = (reader: Reader, filter: string) => {
          const searchStr = filter.toLowerCase();
          return (
            (reader.fullName?.toLowerCase().includes(searchStr) || false) ||
            (reader.readerCode?.toLowerCase().includes(searchStr) || false) ||
            (reader.phoneNumber?.includes(searchStr) || false) ||
            (reader.email?.toLowerCase().includes(searchStr) || false)
          );
        };
        this.cdr.markForCheck(); 
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách độc giả:', err);
        this.notation.error('❌ Không thể tải danh sách độc giả từ máy chủ!');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * ➕ MỞ POPUP THÊM ĐỘC GIẢ MỚI
   */
  openAddForm(): void {
    const dialogRef = this.dialog.open(ReaderFormComponent, {
      width: '550px',
      disableClose: true, // Không cho tắt khi bấm trượt ra ngoài nền mờ
      panelClass: 'custom-modern-dialog',
      data: {
        isEditMode: false,
        reader: { id: 0, readerCode: '', fullName: '', phoneNumber: '', email: '' }
      }
    });

    dialogRef.afterClosed().pipe(take(1), takeUntil(this.destroy$)).subscribe((result: Reader | null) => {
      if (result) {
        this.executeSave(result, false);
      }
    });
  }

  /**
   * 📝 MỞ POPUP SỬA ĐỘC GIẢ
   */
  openEditForm(reader: Reader): void {
    const dialogRef = this.dialog.open(ReaderFormComponent, {
      width: '550px',
      disableClose: true,
      data: {
        isEditMode: true,
        reader: { ...reader } // Sao chép giá trị gốc, bảo vệ dữ liệu trên hàng của bảng
      }
    });

    dialogRef.afterClosed().pipe(take(1), takeUntil(this.destroy$)).subscribe((result: Reader | null) => {
      if (result) {
        this.executeSave(result, true);
      }
    });
  }

  /**
   * 💾 XỬ LÝ LƯU GỌI API XUỐNG SERVER
   */
  private executeSave(readerData: Reader, isEditMode: boolean): void {
    const payload = { ...readerData } as any;

    if (isEditMode && payload.id) {
      // 🔹 Luồng Cập Nhật
      this.readerService.updateReader(payload.id, payload).pipe(take(1), takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.notation.success('🎉 Cập nhật thông tin độc giả thành công!'); 
          this.loadReaders();
        },
        error: (err) => this.notation.error(err.error?.message || '❌ Lỗi khi chỉnh sửa độc giả!') 
      });
    } else {
      // 🔹 Luồng Thêm Mới
      delete payload.id; 
      payload.readerCode = "AUTO"; 

      this.readerService.createReader(payload).pipe(take(1), takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.notation.success('✨ Đăng ký thẻ độc giả mới thành công!'); 
          this.loadReaders();
        },
        error: (err) => this.notation.error(err.error?.message || '❌ Không thể tạo mới độc giả!') 
      });
    }
  }

  /**
   * 🗑️ XÓA ĐỘC GIẢ
   */
  deleteReader(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: '⚠️ Xác nhận xóa độc giả',
        message: 'Bạn có chắc chắn muốn xóa độc giả này khỏi hệ thống không? Hành động này không thể hoàn tác.'
      }
    });

    dialogRef.afterClosed().pipe(take(1), takeUntil(this.destroy$)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.readerService.deleteReader(id).pipe(take(1), takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.notation.success('🗑️ Đã xóa độc giả khỏi hệ thống!'); 
            this.loadReaders();
          },
          error: (err) => this.notation.error('❌ Không thể xóa độc giả này!') 
        });
      }
    });
  }
}