package com.example.library_project.controller;

import com.example.library_project.dto.ReportStatsDTO;
import com.example.library_project.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow-cards")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/current")
    public ResponseEntity<List<Map<String, Object>>> getCurrentlyBorrowing() {
        return ResponseEntity.ok(reportService.getCurrentlyBorrowing());
    }

    @GetMapping("/stats")
    public ResponseEntity<ReportStatsDTO> getReportStats(
            @RequestParam(value = "year", defaultValue = "2026") int year,
            @RequestParam(value = "month", defaultValue = "6") int month) {
        return ResponseEntity.ok(reportService.getReportStats(year, month));
    }
}