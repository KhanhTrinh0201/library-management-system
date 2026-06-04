package com.example.library_project.controller;

import com.example.library_project.entity.Reader;
import com.example.library_project.service.ReaderService;
import jakarta.validation.Valid; // 🔥 BẮT BUỘC PHẢI CÓ
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/readers")
@CrossOrigin(origins = "http://localhost:4200") 
public class ReaderController {

    @Autowired
    private ReaderService readerService;

    @GetMapping
    public List<Reader> getAllReaders() {
        return readerService.getAllReaders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reader> getReaderById(@PathVariable Long id) {
        return ResponseEntity.ok(readerService.getReaderById(id));
    }

    @PostMapping
    // 🔥 Thêm @Valid để chặn dữ liệu bẩn khi tạo mới độc giả
    public ResponseEntity<?> createReader(@Valid @RequestBody Reader reader) {
        try {
            Reader newReader = readerService.createReader(reader);
            return ResponseEntity.ok(newReader);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    // 🔥 Thêm @Valid để chặn dữ liệu bẩn khi cập nhật độc giả
    public ResponseEntity<?> updateReader(@PathVariable Long id, @Valid @RequestBody Reader readerDetails) {
        try {
            Reader updatedReader = readerService.updateReader(id, readerDetails);
            return ResponseEntity.ok(updatedReader);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReader(@PathVariable Long id) {
        try {
            readerService.deleteReader(id);
            return ResponseEntity.ok(Map.of("message", "Xóa độc giả thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}