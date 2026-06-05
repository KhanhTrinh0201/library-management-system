package com.example.library_project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "readers")
public class Reader {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🌟 SỬA: Gỡ @NotBlank để Controller cho phép đi qua, giữ lại các ràng buộc định dạng
    @Size(min = 3, max = 20, message = "Mã độc giả phải từ 3 đến 20 ký tự") 
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Mã độc giả chỉ được chứa chữ cái và số, không chứa khoảng trắng")
    @Column(name = "reader_code", unique = true, nullable = false)
    private String readerCode;

    @NotBlank(message = "Họ tên độc giả không được để trống")
    @Size(min = 2, max = 50, message = "Họ tên phải từ 2 đến 50 ký tự")
    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấẦẩẫẬắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲÝỴÝỶỸửữựỳýỵỷỹ\\s]+$", 
             message = "Họ tên không được chứa số hoặc ký tự đặc biệt")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "Số điện thoại không đúng định dạng (phải gồm 10 chữ số VN)")
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @NotBlank(message = "Email không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[gG][mM][aA][iI][lL]\\.[cC][oO][mM]$", 
         message = "Địa chỉ email không đúng định dạng (Hệ thống chỉ chấp nhận tài khoản @gmail.com)")
@Column(name = "email", nullable = false)
private String email;

    // 👑 TỰ ĐỘNG SINH MÃ TRƯỚC KHI LƯU (Dự phòng bảo vệ Database)
    @PrePersist
    public void prePersist() {
        if (this.readerCode == null || this.readerCode.trim().isEmpty() || "AUTO".equals(this.readerCode)) {
            // Tạo mã độc giả tự động dựa trên mã Unix timestamp để đảm bảo không bao giờ trùng lặp
            this.readerCode = "DG" + System.currentTimeMillis() / 1000;
        }
    }

    // --- CONSTRUCTOR ---
    public Reader() {}

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReaderCode() { return readerCode; }
    public void setReaderCode(String readerCode) { this.readerCode = readerCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}