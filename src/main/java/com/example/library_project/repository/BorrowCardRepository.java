package com.example.library_project.repository;

import com.example.library_project.entity.BorrowCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface BorrowCardRepository extends JpaRepository<BorrowCard, Long> {

    // 👑 ĐÃ ĐỒNG BỘ: Sử dụng Alias dạng có ngoặc kép \"...\" giúp Angular nhận dữ liệu mượt mà, không lo lỗi mapping 500
    @Query(value = "SELECT b.borrower_name as \"borrowerName\", bk.title as \"bookTitle\", " +
                   "TO_CHAR(b.borrow_date, 'YYYY-MM-DD') as \"borrowDate\", " +
                   "TO_CHAR(b.due_date, 'YYYY-MM-DD') as \"dueDate\", " +
                   "b.phone_number as \"phoneNumber\", " +
                   "CASE WHEN b.due_date < CURRENT_DATE THEN 'Quá hạn' ELSE 'Đang mượn' END as \"status\" " +
                   "FROM borrow_cards b " +
                   "JOIN books bk ON b.book_id = bk.id " +
                   "WHERE b.return_date IS NULL", nativeQuery = true)
    List<Map<String, Object>> findCurrentlyBorrowing();

    @Query(value = "SELECT COUNT(*) FROM borrow_cards WHERE return_date IS NULL AND due_date < CURRENT_DATE", nativeQuery = true)
    long countOverdueCards();

    @Query(value = "SELECT CAST(TO_CHAR(borrow_date, 'ID') AS INTEGER) as day_of_week, COUNT(*) as count " +
            "FROM borrow_cards " +
            "WHERE EXTRACT(YEAR FROM borrow_date) = :year " +
            "AND EXTRACT(MONTH FROM borrow_date) = :month " +
            "GROUP BY day_of_week ORDER BY day_of_week", nativeQuery = true)
    List<Map<String, Object>> getWeeklyBorrowStats(@Param("year") int year, @Param("month") int month);

    @Query(value = "SELECT EXTRACT(MONTH FROM borrow_date) as month, COUNT(*) as count " +
            "FROM borrow_cards " +
            "WHERE EXTRACT(YEAR FROM borrow_date) = :year " +
            "GROUP BY month ORDER BY month", nativeQuery = true)
    List<Map<String, Object>> getMonthlyBorrowStats(@Param("year") int year);

    List<BorrowCard> findByBookIdAndReturnDateIsNull(Long bookId);
}