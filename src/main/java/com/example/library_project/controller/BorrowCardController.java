package com.example.library_project.controller;

import com.example.library_project.entity.Book;
import com.example.library_project.entity.BorrowCard;
import com.example.library_project.repository.BorrowCardRepository;
import com.example.library_project.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow-cards")
@CrossOrigin(origins = "http://localhost:4200")
public class BorrowCardController {

    private final BorrowCardRepository borrowCardRepository;
    private final BookService bookService;

    public BorrowCardController(
            BorrowCardRepository borrowCardRepository,
            BookService bookService) {

        this.borrowCardRepository = borrowCardRepository;
        this.bookService = bookService;
    }

    // =========================================================================
    // 1. MƯỢN SÁCH
    // =========================================================================
    @PostMapping
    public ResponseEntity<?> createBorrowCard(
            @jakarta.validation.Valid
            @RequestBody com.example.library_project.dto.BorrowRequest payload) {

        Long bookId = payload.getBookId();
        String borrowerName = payload.getBorrowerName();
        String phoneNumber = payload.getPhoneNumber();
        String note = payload.getNote();

        String dueDateStr = payload.getDueDate();

        LocalDate dueDate =
                (dueDateStr != null)
                        ? LocalDate.parse(dueDateStr)
                        : LocalDate.now().plusDays(14);

        // Kiểm tra hạn trả
        if (dueDate.isBefore(LocalDate.now())
                || dueDate.isEqual(LocalDate.now())) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "❌ Hạn trả sách phải là một ngày trong tương lai!"
                    )
            );
        }

        // Lấy thông tin sách
        Book book = bookService.getBookById(bookId);

        // Kiểm tra tồn kho
        if (book.getAvailableQuantity() == null
                || book.getAvailableQuantity() <= 0) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "❌ Sách này hiện đã được mượn hết, vui lòng chọn cuốn khác!"
                    )
            );
        }

        // Giảm số lượng khả dụng
        book.setAvailableQuantity(
                book.getAvailableQuantity() - 1
        );

        bookService.saveBook(book);

        // Tạo phiếu mượn
        BorrowCard card = new BorrowCard();

        card.setBookId(bookId);
        card.setBorrowerName(borrowerName);
        card.setPhoneNumber(phoneNumber);
        card.setBorrowDate(LocalDate.now());
        card.setDueDate(dueDate);
        card.setNote(note);
        card.setReturnDate(null);

        borrowCardRepository.save(card);

        return ResponseEntity.ok(
                Map.of("message", "Mượn sách thành công!")
        );
    }

    // =========================================================================
    // 2. DANH SÁCH ĐANG MƯỢN THEO SÁCH
    // =========================================================================
    @GetMapping("/active-by-book/{bookId}")
    public ResponseEntity<List<BorrowCard>> getActiveCardsByBook(
            @PathVariable Long bookId) {

        List<BorrowCard> activeCards =
                borrowCardRepository
                        .findByBookIdAndReturnDateIsNull(bookId);

        return ResponseEntity.ok(activeCards);
    }

    // =========================================================================
    // 3. TRẢ SÁCH
    // =========================================================================
    @PutMapping("/return/{cardId}")
    public ResponseEntity<?> returnBook(
            @PathVariable Long cardId) {

        BorrowCard cardToReturn =
                borrowCardRepository.findById(cardId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy phiếu mượn hợp lệ!"
                                ));

        if (cardToReturn.getReturnDate() != null) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "message",
                            "Phiếu mượn này đã được xử lý trả từ trước!"
                    )
            );
        }

        // Đánh dấu đã trả
        cardToReturn.setReturnDate(LocalDate.now());

        borrowCardRepository.save(cardToReturn);

        // Hoàn lại số lượng khả dụng
        Book book =
                bookService.getBookById(cardToReturn.getBookId());

        if (book.getAvailableQuantity() != null) {

            book.setAvailableQuantity(
                    book.getAvailableQuantity() + 1
            );
        }

        // KHÔNG tăng quantity
        // quantity là tổng kho
        // availableQuantity là số sách còn cho mượn

        bookService.saveBook(book);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Trả sách và cập nhật kho thành công!"
                )
        );
    }
}