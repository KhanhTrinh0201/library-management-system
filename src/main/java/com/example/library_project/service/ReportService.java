package com.example.library_project.service;

import com.example.library_project.dto.ReportStatsDTO;
import com.example.library_project.repository.BookRepository;
import com.example.library_project.repository.BorrowCardRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ReportService {

    private final BorrowCardRepository borrowCardRepository;
    private final BookRepository bookRepository;

    public ReportService(BorrowCardRepository borrowCardRepository, BookRepository bookRepository) {
        this.borrowCardRepository = borrowCardRepository;
        this.bookRepository = bookRepository;
    }

    public List<Map<String, Object>> getCurrentlyBorrowing() {
        return borrowCardRepository.findCurrentlyBorrowing();
    }

    public ReportStatsDTO getReportStats(int year, int month) {
        Long totalBooksRaw = bookRepository.sumAllBooks();
        long totalBooks = (totalBooksRaw != null) ? totalBooksRaw : 0L;
        long overdueCount = borrowCardRepository.countOverdueCards();

        // 1. Xử lý dữ liệu Tuần (Dựa vào Year và Month người dùng chọn)
        List<String> weeklyLabels = Arrays.asList("Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật");
        List<Long> weeklyValues = new ArrayList<>(Collections.nCopies(7, 0L)); 
        
        List<Map<String, Object>> weeklyRaw = borrowCardRepository.getWeeklyBorrowStats(year, month);
        if (weeklyRaw != null) {
            for (Map<String, Object> row : weeklyRaw) {
                if (row.get("day_of_week") != null && row.get("count") != null) {
                    int rawDay = ((Number) row.get("day_of_week")).intValue();
                    long count = ((Number) row.get("count")).longValue();
                    int dayIndex = rawDay - 1; 
                    if (dayIndex >= 0 && dayIndex < 7) {
                        weeklyValues.set(dayIndex, count);
                    }
                }
            }
        }

        // 2. Xử lý dữ liệu Tháng (Dựa vào Year người dùng chọn)
        List<String> monthlyLabels = Arrays.asList("Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12");
        List<Long> monthlyValues = new ArrayList<>(Collections.nCopies(12, 0L)); 

        List<Map<String, Object>> monthlyRaw = borrowCardRepository.getMonthlyBorrowStats(year);
        if (monthlyRaw != null) {
            for (Map<String, Object> row : monthlyRaw) {
                if (row.get("month") != null && row.get("count") != null) {
                    int monthIndex = ((Number) row.get("month")).intValue() - 1;
                    long count = ((Number) row.get("count")).longValue();
                    if (monthIndex >= 0 && monthIndex < 12) {
                        monthlyValues.set(monthIndex, count);
                    }
                }
            }
        }

        return new ReportStatsDTO(totalBooks, overdueCount, weeklyLabels, weeklyValues, monthlyLabels, monthlyValues);
    }
}