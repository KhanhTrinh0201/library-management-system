package com.example.library_project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên sách không được để trống")
    @Size(min = 3, max = 150, message = "Tên sách phải từ 3 đến 150 ký tự")
    private String title;

    @NotBlank(message = "Tên tác giả không được để trống")
    @Pattern(regexp = "^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲÝỴÝỶỸửữựỳýỵỷỹ\\s]+$", 
             message = "Tên tác giả không được chứa số hoặc ký tự đặc biệt")
    private String author;

    @NotBlank(message = "Thể loại sách không được để trống")
    private String category;

    @NotNull(message = "Số lượng tổng không được để trống")
    @Min(value = 1, message = "Số lượng sách nhập kho tối thiểu phải là 1 quyển")
    @Max(value = 1000, message = "Số lượng sách nhập một lần không được vượt quá 1000 quyển")
    private Integer quantity;


    @Column(name = "availablequantity") 
    @NotNull(message = "Số lượng sẵn có không được để trống")
    @Min(value = 0, message = "Số lượng sách sẵn có trong kho không được nhỏ hơn 0")
    private Integer availableQuantity;

    private String status;

    // --- GETTERS AND SETTERS (Giữ nguyên không thay đổi) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}