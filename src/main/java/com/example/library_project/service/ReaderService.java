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

    public Reader createReader(Reader reader) {
        if (readerRepository.findByReaderCode(reader.getReaderCode()).isPresent()) {
            throw new RuntimeException("Mã độc giả " + reader.getReaderCode() + " đã tồn tại!");
        }
        return readerRepository.save(reader);
    }

    public Reader updateReader(Long id, Reader readerDetails) {
        Reader reader = getReaderById(id);
        reader.setFullName(readerDetails.getFullName());
        reader.setPhoneNumber(readerDetails.getPhoneNumber());
        reader.setEmail(readerDetails.getEmail());
        return readerRepository.save(reader);
    }

    public void deleteReader(Long id) {
        Reader reader = getReaderById(id);
        readerRepository.delete(reader);
    }
}