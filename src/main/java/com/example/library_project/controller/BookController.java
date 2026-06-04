package com.example.library_project.controller;

import com.example.library_project.entity.Book;
import com.example.library_project.service.BookService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin("*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        System.out.println("BE tra ve so luong sach: " + books.size());
        return books;
    }

    @PostMapping
    public Book createBook(@Valid @RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return bookService.searchBooks(keyword);
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PutMapping("/{id}")
    public Book updateBook(
            @PathVariable Long id,
            @Valid @RequestBody Book book) {

        return bookService.updateBook(id, book);
    }
}