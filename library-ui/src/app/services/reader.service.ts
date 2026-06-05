import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reader } from '../models/reader';

/**
 * @description Dịch vụ quản lý kết nối API liên quan đến Độc giả (Reader).
 * '@Injectable' với 'providedIn: root' giúp dịch vụ này biến thành một Singleton,
 * có thể sử dụng ở bất kỳ Component nào trong toàn bộ dự án mà không cần khai báo lại.
 */
@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  // 🌟 Inject HttpClient: Công cụ của Angular dùng để bắn các Request qua mạng (GET, POST, PUT, DELETE)
  private http = inject(HttpClient);
  
  // 🌐 Đường dẫn gốc kết nối đến các API của Backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/readers'; 

  /**
   * 🔄 1. LẤY DANH SÁCH TOÀN BỘ ĐỘC GIẢ
   * @returns Một Observable chứa mảng các đối tượng Reader đổ về từ Backend
   */
  getAllReaders(): Observable<Reader[]> {
    return this.http.get<Reader[]>(this.apiUrl);
  }

  /**
   * 🔍 2. LẤY THÔNG TIN CHI TIẾT MỘT ĐỘC GIẢ THEO ID
   * @param id Mã định danh của độc giả cần tìm
   * @returns Một Observable chứa thông tin của duy nhất độc giả đó
   */
  getReaderById(id: number): Observable<Reader> {
    return this.http.get<Reader>(`${this.apiUrl}/${id}`);
  }

  /**
   * ➕ 3. TẠO MỚI THẺ ĐỘC GIẢ
   * @param reader Đối tượng độc giả chứa dữ liệu từ Form gửi lên (Tên, SĐT, Email...)
   * @returns Kết quả độc giả vừa được lưu thành công dưới Database
   */
  createReader(reader: Reader): Observable<Reader> {
    return this.http.post<Reader>(this.apiUrl, reader);
  }

  /**
   * 📝 4. CẬP NHẬT THÔNG TIN ĐỘC GIẢ
   * @param id Mã định danh của độc giả cần sửa
   * @param reader Dữ liệu mới cần đè lên dữ liệu cũ
   * @returns Kết quả độc giả sau khi đã sửa đổi thành công
   */
  updateReader(id: number, reader: Reader): Observable<Reader> {
    return this.http.put<Reader>(`${this.apiUrl}/${id}`, reader);
  }

  /**
   * ❌ 5. XÓA ĐỘC GIẢ KHỎI HỆ THỐNG
   * @param id Mã định danh của độc giả cần xóa
   * @returns Trạng thái phản hồi từ máy chủ (thường là thông báo thành công hoặc không có nội dung)
   */
  deleteReader(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}