package com.example.library_project.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class BorrowRequest {

    @NotNull(message = "Mã sách không được để trống")
    private Long bookId;

    @NotBlank(message = "Tên người mượn không được để trống")
    private String borrowerName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "Số điện thoại không đúng định dạng Việt Nam (10 chữ số)")
    private String phoneNumber;

    @NotBlank(message = "Hạn trả sách không được để trống")
    // Nhận chuỗi ngày từ Angular để tự parse sau, hoặc dùng LocalDate trực tiếp
    private String dueDate;

    private String note;

    // --- GETTERS AND SETTERS ---
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBorrowerName() { return borrowerName; }
    public void setBorrowerName(String borrowerName) { this.borrowerName = borrowerName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}