package com.example.library_project.service;

import com.example.library_project.entity.Book;
import com.example.library_project.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {

        validateBook(book);
        updateStatus(book);

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {

        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found");
        }

        bookRepository.deleteById(id);
    }

    public Book getBookById(Long id) {

        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));
    }

    public Book updateBook(Long id, Book updatedBook) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found"));

        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setCategory(updatedBook.getCategory());
        book.setQuantity(updatedBook.getQuantity());

        book.setAvailableQuantity(
                updatedBook.getAvailableQuantity()
        );

        validateBook(book);
        updateStatus(book);

        return bookRepository.save(book);
    }

    public List<Book> searchBooks(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCase(keyword);
    }

    private void validateBook(Book book) {

        if (book.getAvailableQuantity() > book.getQuantity()) {

            throw new RuntimeException(
                    "Available quantity cannot exceed quantity"
            );
        }
    }

    private void updateStatus(Book book) {

        if (book.getAvailableQuantity() > 0) {
            book.setStatus("Available");
        } else {
            book.setStatus("Out of Stock");
        }
    }
}