import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book'; // Đảm bảo đường dẫn đúng

@Injectable({ providedIn: 'root' })
export class BorrowService {
  private http = inject(HttpClient);
  
  // 1. Tách apiUrl gốc ra để dùng chung cho nhiều bảng khác nhau
  private apiUrl = 'http://localhost:8080/api'; 

  // ==========================================
  // I. CÁC LỆNH TƯƠNG TÁC VỚI BẢNG BOOKS
  // ==========================================

  // Lấy toàn bộ sách hiển thị ra bảng
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  // Cập nhật trạng thái/số lượng sách
  updateBookStatus(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/books/${id}`, book);
  }

  // ==========================================
  // II. CÁC LỆNH TƯƠNG TÁC VỚI BẢNG BORROW_CARDS
  // ==========================================
  
  // Gửi lệnh tạo phiếu mượn mới vào bảng borrow_cards
  createBorrowCard(borrowData: { bookId: number, borrowerName: string, phoneNumber: string, borrowDate?: string, dueDate: string, note: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/borrow-cards`, borrowData);
  }

  // Gửi lệnh xử lý trả sách (Cập nhật cột return_date của phiếu mượn)
  // 👑 ĐÃ SỬA: Đổi tên từ bookId thành cardId để khớp với @PutMapping("/return/{cardId}") của Backend
  returnBookCard(cardId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/borrow-cards/return/${cardId}`, {});
  }

  // Lấy danh sách những người đang mượn (để hiện ở trang Báo cáo)
  getCurrentlyBorrowing(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/borrow-cards/current`);
  }

  // Lấy toàn bộ số liệu thống kê & mảng dữ liệu vẽ biểu đồ
  getReportStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/borrow-cards/stats`);
  }

  // Lấy số liệu thống kê lọc theo Tháng / Năm
  // 👑 ĐÃ SỬA: Quy về dùng chung biến ${this.apiUrl} cho sạch sẽ, chuyên nghiệp
  getReportStatsWithParams(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/borrow-cards/stats?year=${year}&month=${month}`);
  }
}