import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BorrowService } from '../../services/borrow.service';
import { ReportListDialogComponent } from './report-list-dialog/report-list-dialog';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTabsModule, 
    MatIconModule, 
    MatDialogModule,
    MatSelectModule, 
    MatFormFieldModule,
    BaseChartDirective
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  private borrowService = inject(BorrowService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  borrowingList: any[] = [];
  totalBooks = 0;
  totalBorrowing = 0;
  overdueCount = 0;

  selectedYear = 2026; 
  selectedMonth = 6;   
  years: number[] = [2024, 2025, 2026, 2027]; 
  months: number[] = Array(12).fill(0);       

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  public weeklyChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public monthlyChartData: ChartConfiguration<'line'>['data'] | null = null;

  ngOnInit(): void {
    this.loadRealDatabaseData();
  }

  loadRealDatabaseData() {
    this.borrowService.getCurrentlyBorrowing().subscribe({
      next: (res: any[]) => {
        this.borrowingList = res;
        this.totalBorrowing = res.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi khi lấy danh sách mượn:', err)
    });

    this.fetchStats();
  }

  fetchStats() {
    this.weeklyChartData = null;
    this.monthlyChartData = null;

    this.borrowService.getReportStatsWithParams(this.selectedYear, this.selectedMonth).subscribe({
      next: (stats: any) => {
        this.totalBooks = stats.totalBooks || 0;
        this.overdueCount = stats.overdueCount || 0;

        this.weeklyChartData = {
          labels: stats.weeklyLabels || [],
          datasets: [{ data: stats.weeklyValues || [], label: `Lượt mượn tháng ${this.selectedMonth}/${this.selectedYear}`, backgroundColor: '#1976d2' }]
        };

        this.monthlyChartData = {
          labels: stats.monthlyLabels || [],
          datasets: [{ data: stats.monthlyValues || [], label: `Lượt mượn trong năm ${this.selectedYear}`, borderColor: '#4caf50', fill: true, tension: 0.3 }]
        };

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Lỗi khi tải thống kê biểu đồ:', err)
    });
  }

  onFilterChange() {
    this.fetchStats(); 
  }

  /**
   * 🔥 ĐÃ CẬP NHẬT: Hàm xem danh sách đang được mượn
   * Backend JPQL đã trả về danh sách b.returnDate IS NULL sẵn rồi, ta chỉ việc mở Dialog và truyền thẳng vào.
   */
  viewBorrowingDetails() {
    if (!this.borrowingList || this.borrowingList.length === 0) {
      console.warn("Danh sách sách đang mượn trống!");
      return;
    }

    this.dialog.open(ReportListDialogComponent, {
      width: '850px',
      disableClose: false,
      data: {
        title: 'Danh sách sách đang được mượn',
        list: this.borrowingList 
      }
    });
  }

  /**
   * 🔥 ĐÃ CẬP NHẬT: Hàm xem danh sách phiếu quá hạn
   * Cơ chế lọc bọc an toàn tự động tìm kiếm key 'status' không phân biệt chữ HOA hay chữ thường.
   */
  viewOverdueDetails() {
    if (!this.borrowingList || this.borrowingList.length === 0) {
      console.warn("Không có dữ liệu mượn để lọc quá hạn!");
      return;
    }

    // Tiến hành lọc danh sách một cách an toàn thông qua kiểm tra trùng khớp chữ thường
    const overdueList = this.borrowingList.filter(card => {
      const statusKey = Object.keys(card).find(k => k.toLowerCase() === 'status');
      if (statusKey) {
        const val = String(card[statusKey]).trim();
        return val === 'Quá hạn' || val === 'QUÁ HẠN';
      }
      return false;
    });

    this.dialog.open(ReportListDialogComponent, {
      width: '850px',
      disableClose: false,
      data: {
        title: 'Danh sách phiếu mượn quá hạn',
        list: overdueList
      }
    });
  }
}