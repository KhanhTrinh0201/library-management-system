package com.example.library_project.repository;

import com.example.library_project.entity.Reader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReaderRepository extends JpaRepository<Reader, Long> {
    Optional<Reader> findByReaderCode(String readerCode);
}