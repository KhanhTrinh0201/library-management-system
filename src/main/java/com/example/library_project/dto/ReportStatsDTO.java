package com.example.library_project.dto;

import java.util.List;

public class ReportStatsDTO {
    private long totalBooks;
    private long overdueCount;
    private List<String> weeklyLabels;
    private List<Long> weeklyValues;
    private List<String> monthlyLabels;
    private List<Long> monthlyValues;

    // 1. Constructor bắt buộc phải có để ReportService gọi lệnh "new"
    public ReportStatsDTO(long totalBooks, long overdueCount, 
                          List<String> weeklyLabels, List<Long> weeklyValues, 
                          List<String> monthlyLabels, List<Long> monthlyValues) {
        this.totalBooks = totalBooks;
        this.overdueCount = overdueCount;
        this.weeklyLabels = weeklyLabels;
        this.weeklyValues = weeklyValues;
        this.monthlyLabels = monthlyLabels;
        this.monthlyValues = monthlyValues;
    }

    // 2. Các hàm Getter và Setter để Spring tự động chuyển đổi thành dữ liệu JSON
    public long getTotalBooks() { return totalBooks; }
    public void setTotalBooks(long totalBooks) { this.totalBooks = totalBooks; }
    
    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }
    
    public List<String> getWeeklyLabels() { return weeklyLabels; }
    public void setWeeklyLabels(List<String> weeklyLabels) { this.weeklyLabels = weeklyLabels; }
    
    public List<Long> getWeeklyValues() { return weeklyValues; }
    public void setWeeklyValues(List<Long> weeklyValues) { this.weeklyValues = weeklyValues; }
    
    public List<String> getMonthlyLabels() { return monthlyLabels; }
    public void setMonthlyLabels(List<String> monthlyLabels) { this.monthlyLabels = monthlyLabels; }
    
    public List<Long> getMonthlyValues() { return monthlyValues; }
    public void setMonthlyValues(List<Long> monthlyValues) { this.monthlyValues = monthlyValues; }
}