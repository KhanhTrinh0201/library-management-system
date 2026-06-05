package com.example.library_project.service;

import com.example.library_project.entity.Reader;
import com.example.library_project.repository.ReaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReaderService {

    @Autowired
    private ReaderRepository readerRepository;

    public List<Reader> getAllReaders() {
        return readerRepository.findAll();
    }

    public Reader getReaderById(Long id) {
        return readerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy độc giả với ID: " + id));
    }

    /**
     * ➕ TẠO ĐỘC GIẢ MỚI VỚI MÃ TỰ SINH THÔNG MINH
     */
    public Reader createReader(Reader reader) {
    // Check trùng mã độc giả (nếu có truyền)
    if (reader.getReaderCode() != null && readerRepository.findByReaderCode(reader.getReaderCode()).isPresent()) {
        throw new RuntimeException("Mã độc giả " + reader.getReaderCode() + " đã tồn tại!");
    }
    
    // 🌟 CHECK TRÙNG EMAIL KHI THÊM MỚI:
    if (readerRepository.findByEmail(reader.getEmail()).isPresent()) {
        throw new RuntimeException("Địa chỉ email " + reader.getEmail() + " đã tồn tại trên hệ thống!");
    }
    
    return readerRepository.save(reader);
}

    public Reader updateReader(Long id, Reader readerDetails) {
    // 1. Tìm độc giả gốc hiện tại trong DB ra
    Reader reader = getReaderById(id);
    
    // 🌟 KIỂM TRA TRÙNG EMAIL KHI SỬA:
    // Nếu email gửi lên khác với email gốc hiện tại của độc giả này
    if (!reader.getEmail().equalsIgnoreCase(readerDetails.getEmail())) {
        // Quét DB xem có AI KHÁC đang chiếm hữu email mới này chưa
        java.util.Optional<Reader> existingReader = readerRepository.findByEmail(readerDetails.getEmail());
        if (existingReader.isPresent() && !existingReader.get().getId().equals(id)) {
            throw new RuntimeException("Địa chỉ email " + readerDetails.getEmail() + " đã được đăng ký bởi độc giả khác!");
        }
        // Nếu không trùng với ai mới tiến hành cập nhật email mới
        reader.setEmail(readerDetails.getEmail());
    }

    // 2. Cập nhật các trường thông tin còn lại bình thường
    reader.setFullName(readerDetails.getFullName());
    reader.setPhoneNumber(readerDetails.getPhoneNumber());
    
    // 3. Tiến hành lưu lại vào DB
    return readerRepository.save(reader);
}

    public void deleteReader(Long id) {
        Reader reader = getReaderById(id);
        readerRepository.delete(reader);
    }

    /**
     * 👑 HÀM SINH MÃ ĐỘC GIẢ DUY NHẤT (Ví dụ kết quả: DG48102)
     */
    private String generateUniqueReaderCode() {
        String newCode;
        boolean isDuplicate;
        do {
            // Sinh mã ngẫu nhiên gồm chữ DG và một dãy số ngẫu nhiên từ 10000 đến 99999
            int randomNumber = (int) (Math.random() * 90000) + 10000;
            newCode = "DG" + randomNumber;
            
            // Quét kiểm tra DB xem mã này đã vô tình trùng với ai trước đó chưa
            isDuplicate = readerRepository.findByReaderCode(newCode).isPresent();
        } while (isDuplicate); // Nếu trùng thì lặp lại để tạo mã khác
        
        return newCode;
    }
}