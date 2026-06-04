package com.example.library_project.repository;
import java.util.List;

import com.example.library_project.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookRepository extends JpaRepository<Book, Long> {

    // Thêm hàm này để tính tổng số lượng cuốn sách thực tế trong kho
    @Query(value = "SELECT COALESCE(SUM(quantity), 0) FROM books", nativeQuery = true)
    long sumAllBooks();
    List<Book> findByTitleContainingIgnoreCase(String keyword);
    
}