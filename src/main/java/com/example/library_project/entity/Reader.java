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

    // 🔒 Ràng buộc 1: Mã thẻ độc giả không trống, từ 3-10 ký tự, viết liền không dấu
    @NotBlank(message = "Mã độc giả không được để trống")
    @Size(min = 3, max = 10, message = "Mã độc giả phải từ 3 đến 10 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Mã độc giả chỉ được chứa chữ cái và số, không chứa khoảng trắng")
    @Column(name = "reader_code", unique = true, nullable = false)
    private String readerCode;

    // 🔒 Ràng buộc 2: Họ tên không trống, từ 2-50 ký tự, KHÔNG được chứa số/ký tự đặc biệt
    @NotBlank(message = "Họ tên độc giả không được để trống")
    @Size(min = 2, max = 50, message = "Họ tên phải từ 2 đến 50 ký tự")
    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲÝỴÝỶỸửữựỳýỵỷỹ\\s]+$", 
             message = "Họ tên không được chứa số hoặc ký tự đặc biệt")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    // 🔒 Ràng buộc 3: Số điện thoại chuẩn 10 số di động Việt Nam
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(03|05|07|08|09)\\d{8}$", message = "Số điện thoại không đúng định dạng (phải gồm 10 chữ số VN)")
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    // 🔒 Ràng buộc 4: Email hợp lệ
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Địa chỉ email không đúng định dạng hợp lệ")
    @Column(name = "email", nullable = false)
    private String email;

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