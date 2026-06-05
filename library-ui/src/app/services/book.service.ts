import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/books';

  // Lấy danh sách sách
  getAllBooks() {
    console.log('CALL API GET ALL BOOKS');
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Thêm mới
  createBook(book: Book) {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Cập nhật (Sửa)
  updateBook(id: number, book: Book) {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  // Xóa
  deleteBook(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

updateBookStatus(id: number, book: Book) {
  // Hàm này thực chất là gọi PUT, nhưng đặt tên khác để dễ quản lý nghiệp vụ
  return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
}

}